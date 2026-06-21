/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { getCategories, getFavoriteIds, addFavorite, removeFavorite } from '../lib/db';

const RecipesContext = createContext(null);

// Fallback cover photo for recipes that don't have one yet.
export const DEFAULT_RECIPE_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

// Map a Recipe row from the database to the shape the UI components expect.
function mapRecipe(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category || 'Uncategorized',
    time: row.prep_time ? `${row.prep_time} min` : '',
    image: row.cover_img_url || DEFAULT_RECIPE_IMAGE,
    author: row.author?.full_name || 'Unknown',
    rating: null,
    userId: row.user_id,
    isPublic: row.is_public,
    description: row.description || '',
    instructions: row.instructions || '',
    baseServings: row.base_servings || 4,
    prepTime: row.prep_time,
  };
}

export function RecipesProvider({ children }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Read all recipes (newest first) with the author's name.
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('Recipe')
      .select('*, author:Users(full_name:"full name")')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load recipes:', error);
      setError('Could not load recipes. Please try again.');
      setRecipes([]);
    } else {
      setRecipes((data || []).map(mapRecipe));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Load the category list once.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Load the current user's favorites whenever the user changes.
  useEffect(() => {
    let active = true;
    if (!user) {
      setFavoriteIds([]);
      return;
    }
    getFavoriteIds(user.id)
      .then((ids) => { if (active) setFavoriteIds(ids); })
      .catch((err) => console.error('Failed to load favorites:', err));
    return () => { active = false; };
  }, [user]);

  function isFavorite(id) {
    return favoriteIds.includes(id);
  }

  // Toggle a favorite with optimistic UI; revert on error.
  async function toggleFavorite(id) {
    if (!user) return;
    const currently = favoriteIds.includes(id);
    setFavoriteIds((prev) => (currently ? prev.filter((x) => x !== id) : [...prev, id]));
    try {
      if (currently) await removeFavorite(user.id, id);
      else await addFavorite(user.id, id);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      setFavoriteIds((prev) => (currently ? [...prev, id] : prev.filter((x) => x !== id)));
    }
  }

  // Recipes owned by the given user id.
  function getMyRecipes(userId) {
    if (!userId) return [];
    return recipes.filter((r) => r.userId === userId);
  }

  const value = {
    recipes,
    loading,
    error,
    refresh: fetchRecipes,
    getMyRecipes,
    categories,
    favoriteIds,
    isFavorite,
    toggleFavorite,
    searchTerm,
    setSearchTerm,
  };

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) {
    throw new Error('useRecipes must be used inside a <RecipesProvider>');
  }
  return ctx;
}
