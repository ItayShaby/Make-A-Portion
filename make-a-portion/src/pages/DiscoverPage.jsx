import { useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipesContext';
import './MyRecipesPage.css';

export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState('All Recipes');
  const { user, openLogin, requireAuth } = useAuth();
  const { recipes, loading, error, refresh, categories, isFavorite, toggleFavorite, searchTerm } = useRecipes();

  const filters = ['All Recipes', ...categories, 'Saved'];

  const query = searchTerm.trim().toLowerCase();

  let filtered;
  if (query) {
    // A search overrides the category/Saved filter and matches across all recipes.
    filtered = recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.author.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query),
    );
  } else if (activeFilter === 'All Recipes') {
    filtered = recipes;
  } else if (activeFilter === 'Saved') {
    filtered = recipes.filter((r) => isFavorite(r.id));
  } else {
    filtered = recipes.filter((r) => r.category === activeFilter);
  }

  // Guests can browse, but adding a recipe opens the login popup.
  function handleCreate(e) {
    if (!user) {
      e.preventDefault();
      openLogin();
    }
  }

  // Favoriting requires login.
  function onToggleFav(recipeId) {
    requireAuth(() => toggleFavorite(recipeId));
  }

  return (
    <div>
      <div className="my-recipes__header">
        <h1 className="my-recipes__title">
          {query ? `Results for "${searchTerm.trim()}"` : 'Discover Recipes'}
        </h1>
        <p className="my-recipes__subtitle">
          {query
            ? `${filtered.length} recipe${filtered.length === 1 ? '' : 's'} found.`
            : 'Browse every recipe shared on Make A Portion.'}
        </p>
      </div>

      {!query && (
        <div className="my-recipes__filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`my-recipes__filter-btn${activeFilter === filter ? ' my-recipes__filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="my-recipes__status">Loading recipes…</p>}

      {error && (
        <div className="my-recipes__status my-recipes__status--error">
          <p>{error}</p>
          <button className="my-recipes__retry-btn" onClick={refresh}>Try again</button>
        </div>
      )}

      {!loading && !error && (
      <div className="my-recipes__grid">
        {filtered.map((recipe) => (
          <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="my-recipes__card-link">
            <RecipeCard
              image={recipe.image}
              title={recipe.title}
              category={recipe.category}
              time={recipe.time}
              author={recipe.author}
              rating={recipe.rating}
              favorite={isFavorite(recipe.id)}
              onToggleFavorite={() => onToggleFav(recipe.id)}
            />
          </Link>
        ))}

        {!query && (
          <Link to="/add-recipe" onClick={handleCreate} className="my-recipes__create-card">
            <div className="my-recipes__create-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="my-recipes__create-label">Create New</span>
            <span className="my-recipes__create-hint">Add your own recipe</span>
          </Link>
        )}
      </div>
      )}

      {!loading && !error && query && filtered.length === 0 && (
        <p className="my-recipes__status">No recipes match your search.</p>
      )}
    </div>
  );
}
