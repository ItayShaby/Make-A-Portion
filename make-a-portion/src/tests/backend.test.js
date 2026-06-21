// Integration tests for the Make A Portion backend (Supabase).
// They sign in with the test account from .env.test, then exercise real CRUD,
// RLS, ingredient linking and ratings against the live database.
//
// Run with:  npm run test     (headless)
//            npm run test:ui   (browser UI)
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  ensureUserProfile,
  saveRecipeIngredients,
  getRecipeIngredients,
  rateRecipe,
  getRecipeRating,
} from '../lib/db';

const URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const EMAIL = import.meta.env.VITE_TEST_EMAIL;
const PASSWORD = import.meta.env.VITE_TEST_PASSWORD;

let userId;
let recipeId;

beforeAll(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });
  if (error) {
    throw new Error(
      `Could not sign in the test user. Did you fill in .env.test? (${error.message})`,
    );
  }
  userId = data.user.id;

  // Make sure the test user has a Users row (the app does this on login),
  // otherwise the Recipe.user_id foreign key would reject every insert.
  await ensureUserProfile(data.user);
});

afterAll(async () => {
  // Clean up any recipe left behind, then sign out.
  if (recipeId) {
    await supabase.from('Recipe').delete().eq('id', recipeId);
  }
  await supabase.auth.signOut();
});

describe('Recipe CRUD', () => {
  it('1. creating a recipe adds it to the database', async () => {
    const { data, error } = await supabase
      .from('Recipe')
      .insert({
        user_id: userId,
        title: 'Test Recipe',
        category: 'Quick',
        base_servings: 2,
        prep_time: 10,
        is_public: true,
      })
      .select('id')
      .single();

    expect(error).toBeNull();
    expect(data?.id).toBeTruthy();
    recipeId = data.id;
  });

  it('2. reading returns the recipe owned by the current user', async () => {
    const { data, error } = await supabase
      .from('Recipe')
      .select('title, user_id')
      .eq('id', recipeId)
      .single();

    expect(error).toBeNull();
    expect(data.title).toBe('Test Recipe');
    expect(data.user_id).toBe(userId);
  });

  it('3. updating a recipe changes the correct fields', async () => {
    const { error } = await supabase
      .from('Recipe')
      .update({ title: 'Updated Recipe' })
      .eq('id', recipeId);
    expect(error).toBeNull();

    const { data } = await supabase
      .from('Recipe')
      .select('title')
      .eq('id', recipeId)
      .single();
    expect(data.title).toBe('Updated Recipe');
  });

  it('6. saving ingredients links them to the recipe', async () => {
    await saveRecipeIngredients(recipeId, [
      { name: 'Test Salt', quantity: '5', unit: 'g' },
      { name: 'Test Water', quantity: '200', unit: 'ml' },
    ]);

    const ings = await getRecipeIngredients(recipeId);
    expect(ings.length).toBe(2);
    expect(ings.map((i) => i.name)).toContain('Test Salt');
  });

  it('7. rating a recipe upserts (one rating per user)', async () => {
    await rateRecipe(recipeId, userId, 4);
    let r = await getRecipeRating(recipeId, userId);
    expect(r.mine).toBe(4);

    // Rating again updates rather than inserting a second row.
    await rateRecipe(recipeId, userId, 2);
    r = await getRecipeRating(recipeId, userId);
    expect(r.mine).toBe(2);
  });

  it('4. deleting a recipe removes it (and cascades its ingredients)', async () => {
    const { error } = await supabase.from('Recipe').delete().eq('id', recipeId);
    expect(error).toBeNull();

    const { data } = await supabase.from('Recipe').select('id').eq('id', recipeId);
    expect(data.length).toBe(0);

    const ings = await getRecipeIngredients(recipeId);
    expect(ings.length).toBe(0); // cascade removed the junction rows

    recipeId = null;
  });
});

describe('Row Level Security', () => {
  it('5. an anonymous client cannot create a recipe (writes are owner-only)', async () => {
    const anon = createClient(URL, ANON_KEY);
    const { error } = await anon
      .from('Recipe')
      .insert({ user_id: userId, title: 'Hacker Recipe', is_public: true });
    expect(error).not.toBeNull(); // RLS blocks the insert
  });

  it('allows anyone to read recipes (public browsing)', async () => {
    const anon = createClient(URL, ANON_KEY);
    const { data, error } = await anon.from('Recipe').select('id').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
