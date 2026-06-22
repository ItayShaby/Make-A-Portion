import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipesContext';
import './MyRecipesPage.css';

export default function FavoritesPage() {
  const { requireAuth } = useAuth();
  const { recipes, loading, error, refresh, favoriteIds, isFavorite, toggleFavorite } = useRecipes();

  const favs = recipes.filter((r) => favoriteIds.includes(r.id));

  function onToggleFav(id) {
    requireAuth(() => toggleFavorite(id));
  }

  return (
    <div>
      <div className="my-recipes__header">
        <h1 className="my-recipes__title">Favorites</h1>
        <p className="my-recipes__subtitle">Recipes you've saved.</p>
      </div>

      {loading && <p className="my-recipes__status">Loading recipes…</p>}

      {error && (
        <div className="my-recipes__status my-recipes__status--error">
          <p>{error}</p>
          <button className="my-recipes__retry-btn" onClick={refresh}>Try again</button>
        </div>
      )}

      {!loading && !error && favs.length === 0 && (
        <p className="my-recipes__status">
          No favorites yet — tap the heart on any recipe to save it here.
        </p>
      )}

      {!loading && !error && favs.length > 0 && (
        <div className="my-recipes__grid">
          {favs.map((recipe) => (
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
        </div>
      )}
    </div>
  );
}
