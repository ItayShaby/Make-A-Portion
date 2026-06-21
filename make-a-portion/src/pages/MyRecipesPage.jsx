import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipesContext';
import { supabase } from '../lib/supabase';
import './MyRecipesPage.css';

export default function MyRecipesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getMyRecipes, loading, error, refresh } = useRecipes();
  const [deletingId, setDeletingId] = useState(null);

  const myRecipes = getMyRecipes(user?.id);

  async function handleDelete(recipe) {
    if (!window.confirm(`Delete "${recipe.title}"? This can't be undone.`)) return;

    setDeletingId(recipe.id);
    const { error: deleteError } = await supabase
      .from('Recipe')
      .delete()
      .eq('id', recipe.id);
    setDeletingId(null);

    if (deleteError) {
      console.error('Failed to delete recipe:', deleteError);
      window.alert('Could not delete the recipe. Please try again.');
      return;
    }
    await refresh();
  }

  return (
    <div>
      <div className="my-recipes__header">
        <h1 className="my-recipes__title">My Recipes</h1>
        <p className="my-recipes__subtitle">Recipes you've created on Make A Portion.</p>
      </div>

      {loading && <p className="my-recipes__status">Loading recipes…</p>}

      {error && (
        <div className="my-recipes__status my-recipes__status--error">
          <p>{error}</p>
          <button className="my-recipes__retry-btn" onClick={refresh}>Try again</button>
        </div>
      )}

      {!loading && !error && (
      <div className="my-recipes__grid">
        {myRecipes.map((recipe) => (
          <div key={recipe.id} className="my-recipes__card-wrap">
            <Link to={`/recipe/${recipe.id}`} className="my-recipes__card-link">
              <RecipeCard
                image={recipe.image}
                title={recipe.title}
                category={recipe.category}
                time={recipe.time}
                author={recipe.author}
                rating={recipe.rating}
              />
            </Link>
            <div className="my-recipes__card-actions">
              <button
                type="button"
                className="my-recipes__action-btn"
                onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
              >
                Edit
              </button>
              <button
                type="button"
                className="my-recipes__action-btn my-recipes__action-btn--danger"
                onClick={() => handleDelete(recipe)}
                disabled={deletingId === recipe.id}
              >
                {deletingId === recipe.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}

        <Link to="/add-recipe" className="my-recipes__create-card">
          <div className="my-recipes__create-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="my-recipes__create-label">Create New</span>
          <span className="my-recipes__create-hint">
            {myRecipes.length === 0 ? 'Add your first recipe' : 'Add another recipe'}
          </span>
        </Link>
      </div>
      )}
    </div>
  );
}
