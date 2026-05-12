import { useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import './MyRecipesPage.css';

const FILTERS = ['All Recipes', 'Breakfast', 'Main Course', 'Desserts', 'Quick'];

const RECIPES = [
  { id: 1, title: 'Shakshuka with Feta', category: 'Breakfast', time: '25 min', author: 'You', rating: '4.8', image: 'https://placehold.co/400x300' },
  { id: 2, title: 'Lemon Herb Roast Chicken', category: 'Main Course', time: '1h 20min', author: 'You', rating: '4.9', image: 'https://placehold.co/400x300' },
  { id: 3, title: 'Chocolate Lava Cake', category: 'Desserts', time: '20 min', author: 'You', rating: '5.0', image: 'https://placehold.co/400x300' },
  { id: 4, title: 'Avocado Toast', category: 'Quick', time: '10 min', author: 'You', rating: '4.5', image: 'https://placehold.co/400x300' },
  { id: 5, title: 'Pasta Carbonara', category: 'Main Course', time: '30 min', author: 'You', rating: '4.7', image: 'https://placehold.co/400x300' },
  { id: 6, title: 'Banana Pancakes', category: 'Breakfast', time: '20 min', author: 'You', rating: '4.6', image: 'https://placehold.co/400x300' },
];

export default function MyRecipesPage() {
  const [activeFilter, setActiveFilter] = useState('All Recipes');

  const filtered = activeFilter === 'All Recipes'
    ? RECIPES
    : RECIPES.filter((r) => r.category === activeFilter);

  return (
    <div>
      <div className="my-recipes__header">
        <h1 className="my-recipes__title">My Recipes</h1>
        <p className="my-recipes__subtitle">All your saved recipes in one place.</p>
      </div>

      <div className="my-recipes__filters">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className={`my-recipes__filter-btn${activeFilter === filter ? ' my-recipes__filter-btn--active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

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
            />
          </Link>
        ))}

        <Link to="/add-recipe" className="my-recipes__create-card">
          <div className="my-recipes__create-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="my-recipes__create-label">Create New</span>
          <span className="my-recipes__create-hint">Add your first recipe</span>
        </Link>
      </div>
    </div>
  );
}
