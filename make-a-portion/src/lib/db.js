// Central data-access helpers for Make A Portion.
// Every function talks to Supabase and throws on error so callers can
// try/catch and show their own UI feedback.
import { supabase } from './supabase';

/* ----------------------------------------------------------------------------
 * Categories  (global reference list)
 * ------------------------------------------------------------------------- */
export async function getCategories() {
  const { data, error } = await supabase
    .from('Category')
    .select('name')
    .order('display_order');
  if (error) throw error;
  return (data || []).map((c) => c.name);
}

/* ----------------------------------------------------------------------------
 * Ingredient  (global shared library)
 * ------------------------------------------------------------------------- */
// Find an ingredient by name (case-insensitive) or create it; return its id.
export async function findOrCreateIngredient(name) {
  const clean = name.trim();

  const { data: found } = await supabase
    .from('Ingredient')
    .select('id')
    .ilike('name', clean)
    .limit(1)
    .maybeSingle();
  if (found) return found.id;

  const { data: created, error } = await supabase
    .from('Ingredient')
    .insert({ name: clean })
    .select('id')
    .single();

  if (error) {
    // Another insert may have won the race (unique constraint on name) — reuse it.
    const { data: again } = await supabase
      .from('Ingredient')
      .select('id')
      .ilike('name', clean)
      .limit(1)
      .maybeSingle();
    if (again) return again.id;
    throw error;
  }
  return created.id;
}

/* ----------------------------------------------------------------------------
 * Recipe-Ingredients  (junction: a recipe's ingredient list)
 * ------------------------------------------------------------------------- */
export async function getRecipeIngredients(recipeId) {
  const { data, error } = await supabase
    .from('Recipe-Ingredients')
    .select('id, base_quantity, unit, sort_order, ingredient_id, Ingredient(name)')
    .eq('recipe_id', recipeId)
    .order('sort_order');
  if (error) throw error;
  return (data || []).map((r) => ({
    id: r.id,
    name: r.Ingredient?.name || '',
    quantity: r.base_quantity,
    unit: r.unit || '',
    sortOrder: r.sort_order,
  }));
}

// Replace all ingredient rows for a recipe with the given list.
// rows: [{ name, quantity, unit }]
export async function saveRecipeIngredients(recipeId, rows) {
  const { error: delErr } = await supabase
    .from('Recipe-Ingredients')
    .delete()
    .eq('recipe_id', recipeId);
  if (delErr) throw delErr;

  const clean = (rows || []).filter((r) => r.name && r.name.trim());
  if (clean.length === 0) return;

  const toInsert = [];
  for (let i = 0; i < clean.length; i++) {
    const ingredientId = await findOrCreateIngredient(clean[i].name);
    const qty = clean[i].quantity;
    toInsert.push({
      recipe_id: recipeId,
      ingredient_id: ingredientId,
      base_quantity: qty !== '' && qty != null && !Number.isNaN(Number(qty)) ? Number(qty) : null,
      unit: clean[i].unit ? clean[i].unit.trim() : null,
      sort_order: i,
    });
  }

  const { error: insErr } = await supabase.from('Recipe-Ingredients').insert(toInsert);
  if (insErr) throw insErr;
}

/* ----------------------------------------------------------------------------
 * Recipe  (single, with author name)
 * ------------------------------------------------------------------------- */
export async function getRecipe(id) {
  const { data, error } = await supabase
    .from('Recipe')
    .select('*, author:Users(full_name:"full name")')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/* ----------------------------------------------------------------------------
 * Ratings  (one per user per recipe)
 * ------------------------------------------------------------------------- */
export async function getRecipeRating(recipeId, userId) {
  const { data, error } = await supabase
    .from('Ratings')
    .select('score, user_id')
    .eq('recipe_id', recipeId);
  if (error) throw error;

  const rows = data || [];
  const count = rows.length;
  const average = count ? rows.reduce((sum, r) => sum + r.score, 0) / count : 0;
  const mine = userId ? rows.find((r) => r.user_id === userId)?.score ?? 0 : 0;
  return { average, count, mine };
}

export async function rateRecipe(recipeId, userId, score) {
  const { error } = await supabase
    .from('Ratings')
    .upsert({ user_id: userId, recipe_id: recipeId, score }, { onConflict: 'user_id,recipe_id' });
  if (error) throw error;
}

/* ----------------------------------------------------------------------------
 * Comments
 * ------------------------------------------------------------------------- */
export async function getComments(recipeId) {
  const { data, error } = await supabase
    .from('Comments')
    .select('id, content, created_at, user_id')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const rows = data || [];
  const ids = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];

  const names = {};
  if (ids.length) {
    const { data: users } = await supabase
      .from('Users')
      .select('id, full_name:"full name"')
      .in('id', ids);
    (users || []).forEach((u) => { names[u.id] = u.full_name; });
  }

  return rows.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.created_at,
    userId: c.user_id,
    author: names[c.user_id] || 'User',
  }));
}

export async function addComment(recipeId, userId, content) {
  const { error } = await supabase
    .from('Comments')
    .insert({ user_id: userId, recipe_id: recipeId, content });
  if (error) throw error;
}

export async function deleteComment(id) {
  const { error } = await supabase.from('Comments').delete().eq('id', id);
  if (error) throw error;
}

/* ----------------------------------------------------------------------------
 * Favorites  (one per user per recipe)
 * ------------------------------------------------------------------------- */
export async function getFavoriteIds(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('Favorites')
    .select('recipe_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map((f) => f.recipe_id);
}

export async function addFavorite(userId, recipeId) {
  const { error } = await supabase
    .from('Favorites')
    .upsert({ user_id: userId, recipe_id: recipeId }, { onConflict: 'user_id,recipe_id' });
  if (error) throw error;
}

export async function removeFavorite(userId, recipeId) {
  const { error } = await supabase
    .from('Favorites')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', recipeId);
  if (error) throw error;
}

/* ----------------------------------------------------------------------------
 * Users  (profiles)
 * ------------------------------------------------------------------------- */
// Make sure a Users row exists for this auth user (needed for the Recipe FK
// and for showing author names). Safe to call on every login.
export async function ensureUserProfile(user) {
  if (!user) return;
  const { data } = await supabase
    .from('Users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();
  if (!data) {
    // "full name" is NOT NULL. Prefer the name from the auth provider (e.g.
    // Google), otherwise fall back to the email prefix.
    const meta = user.user_metadata || {};
    const fullName =
      meta.full_name || meta.name || (user.email || '').split('@')[0] || 'New User';
    await supabase.from('Users').insert({
      id: user.id,
      email: user.email,
      'full name': fullName,
      avatar_url: meta.avatar_url || meta.picture || null,
    });
  }
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// patch may contain: { 'full name', avatar_url, measurement_system, email }
export async function updateUserProfile(userId, patch) {
  const { error } = await supabase.from('Users').update(patch).eq('id', userId);
  if (error) throw error;
}

/* ----------------------------------------------------------------------------
 * Storage  (image uploads)
 * ------------------------------------------------------------------------- */
// Upload a file to a public bucket under the user's own folder (required by the
// "own folder" storage policies) and return its public URL.
// bucket: 'avatars' | 'Recipe-img'
export async function uploadImage(bucket, userId, file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
