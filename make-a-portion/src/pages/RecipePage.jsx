import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRecipes, DEFAULT_RECIPE_IMAGE } from '../context/RecipesContext';
import {
  getRecipe,
  getRecipeIngredients,
  getRecipeRating,
  rateRecipe,
  getComments,
  addComment,
  deleteComment,
} from '../lib/db';
import './RecipePage.css';

function formatQty(value) {
  if (value == null) return '';
  const rounded = Math.round(value * 100) / 100;
  return rounded % 1 === 0 ? rounded.toString() : String(rounded);
}

// Metric → imperial conversions for the weight/volume units we store.
// Count-based units (יחידות, כפות, שיני…) are left unchanged.
const CONVERSIONS = {
  'גרם': { factor: 1 / 28.3495, unit: 'אונקיות' },        // g → oz
  'קג': { factor: 2.20462, unit: 'פאונד' },               // kg → lb
  'ק"ג': { factor: 2.20462, unit: 'פאונד' },
  'מ"ל': { factor: 1 / 29.5735, unit: 'אונקיות נוזל' },   // ml → fl oz
  'מל': { factor: 1 / 29.5735, unit: 'אונקיות נוזל' },
  'ליטר': { factor: 4.22675, unit: 'כוסות' },             // l → cups
  'ל': { factor: 4.22675, unit: 'כוסות' },
};

// Convert a quantity+unit to the chosen system. Unknown (count) units pass through.
function convertUnit(quantity, unit, system) {
  if (system !== 'imperial' || quantity == null) return { quantity, unit };
  const conv = CONVERSIONS[(unit || '').trim()];
  if (!conv) return { quantity, unit };
  return { quantity: quantity * conv.factor, unit: conv.unit };
}

// Convert Celsius temperatures inside free text to Fahrenheit (imperial only).
// Matches "200°C", "200°", "200 מעלות", "200 צלזיוס".
function convertTemperatures(text, system) {
  if (system !== 'imperial' || !text) return text;
  return text.replace(
    /(\d+(?:\.\d+)?)\s*(?:°\s*c|°|מעלות(?:\s*צלזיוס)?|צלזיוס)/gi,
    (_m, num) => `${Math.round((Number(num) * 9) / 5 + 32)}°F`,
  );
}

export default function RecipePage() {
  const { id } = useParams();
  const { user, profile, requireAuth } = useAuth();
  const { isFavorite, toggleFavorite } = useRecipes();

  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [servings, setServings] = useState(4);
  const [unitSystem, setUnitSystem] = useState('metric');
  const [rating, setRating] = useState({ average: 0, count: 0, mine: 0 });
  const [hoverRating, setHoverRating] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);

  const loadRating = useCallback(async () => {
    try {
      setRating(await getRecipeRating(id, user?.id));
    } catch (err) {
      console.error('Failed to load rating:', err);
    }
  }, [id, user?.id]);

  const loadComments = useCallback(async () => {
    try {
      setComments(await getComments(id));
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const r = await getRecipe(id);
        if (!active) return;
        setRecipe(r);
        setServings(r.base_servings || 4);
        const ings = await getRecipeIngredients(id);
        if (active) setIngredients(ings);
      } catch (err) {
        console.error('Failed to load recipe:', err);
        if (active) setError('Could not load this recipe.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    loadRating();
    loadComments();
    return () => { active = false; };
  }, [id, loadRating, loadComments]);

  // Default the unit system to the user's profile preference.
  useEffect(() => {
    if (profile?.measurementSystem) setUnitSystem(profile.measurementSystem);
  }, [profile?.measurementSystem]);

  if (loading) {
    return <p className="recipe-page__status">Loading recipe…</p>;
  }
  if (error || !recipe) {
    return <p className="recipe-page__status recipe-page__status--error">{error || 'Recipe not found.'}</p>;
  }

  const baseServings = recipe.base_servings || 4;
  const ratio = servings / baseServings;
  const cover = recipe.cover_img_url || DEFAULT_RECIPE_IMAGE;
  const authorName = recipe.author?.full_name || 'Unknown';
  const fav = isFavorite(recipe.id);

  function onToggleFav() {
    requireAuth(() => toggleFavorite(recipe.id));
  }

  function rate(value) {
    requireAuth(async () => {
      try {
        await rateRecipe(id, user.id, value);
        await loadRating();
      } catch (err) {
        console.error('Failed to save rating:', err);
      }
    });
  }

  function submitComment(e) {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    requireAuth(async () => {
      setPosting(true);
      try {
        await addComment(id, user.id, text);
        setCommentText('');
        await loadComments();
      } catch (err) {
        console.error('Failed to post comment:', err);
      } finally {
        setPosting(false);
      }
    });
  }

  async function removeComment(commentId) {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  }

  return (
    <div className="recipe-page">
      <img className="recipe-page__cover" src={cover} alt={recipe.title} />

      <div className="recipe-page__header">
        <div className="recipe-page__header-top">
          <span className="recipe-page__category">{recipe.category}</span>
          <button
            className={`recipe-page__fav${fav ? ' recipe-page__fav--active' : ''}`}
            onClick={onToggleFav}
            aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
          >
            <svg viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {fav ? 'Saved' : 'Save'}
          </button>
        </div>
        <h1 className="recipe-page__title">{recipe.title}</h1>
        <p className="recipe-page__author">by {authorName}</p>
        {recipe.description && <p className="recipe-page__description">{recipe.description}</p>}
      </div>

      <div className="recipe-page__controls">
        <span className="recipe-page__servings-label">Servings</span>
        <div className="recipe-page__servings-control">
          <button
            className="recipe-page__stepper-btn"
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            disabled={servings <= 1}
            aria-label="Decrease servings"
          >
            −
          </button>
          <span className="recipe-page__servings-count">{servings}</span>
          <button
            className="recipe-page__stepper-btn"
            onClick={() => setServings((s) => Math.min(50, s + 1))}
            disabled={servings >= 50}
            aria-label="Increase servings"
          >
            +
          </button>
        </div>

        <div className="recipe-page__unit-toggle">
          <button
            className={`recipe-page__unit-btn${unitSystem === 'metric' ? ' recipe-page__unit-btn--active' : ''}`}
            onClick={() => setUnitSystem('metric')}
          >
            Metric
          </button>
          <button
            className={`recipe-page__unit-btn${unitSystem === 'imperial' ? ' recipe-page__unit-btn--active' : ''}`}
            onClick={() => setUnitSystem('imperial')}
          >
            Imperial
          </button>
        </div>
      </div>

      <h2 className="recipe-page__section-title">Ingredients</h2>
      <div className="recipe-page__ingredients">
        {ingredients.length === 0 ? (
          <p className="recipe-page__comments-empty">No ingredients listed.</p>
        ) : (
          ingredients.map((ing) => {
            const scaled = ing.quantity != null ? ing.quantity * ratio : null;
            const conv = convertUnit(scaled, ing.unit, unitSystem);
            const qty = formatQty(conv.quantity);
            const unitLabel = conv.unit || '';
            return (
              <div key={ing.id} className="recipe-page__ingredient">
                <span className="recipe-page__ingredient-name">{ing.name}</span>
                <span className="recipe-page__ingredient-qty">
                  {qty}{qty && unitLabel ? ` ${unitLabel}` : unitLabel}
                </span>
              </div>
            );
          })
        )}
      </div>

      {recipe.instructions && (
        <>
          <h2 className="recipe-page__section-title">Preparation</h2>
          <p className="recipe-page__instructions">
            {convertTemperatures(recipe.instructions, unitSystem)}
          </p>
        </>
      )}

      {/* Rating */}
      <h2 className="recipe-page__section-title">Rate this recipe</h2>
      <div className="recipe-page__rating">
        <div
          className="recipe-page__stars"
          onMouseLeave={() => setHoverRating(0)}
          role="radiogroup"
          aria-label="Your rating"
        >
          {[1, 2, 3, 4, 5].map((value) => {
            const active = (hoverRating || rating.mine) >= value;
            return (
              <button
                key={value}
                type="button"
                className={`recipe-page__star${active ? ' recipe-page__star--active' : ''}`}
                onMouseEnter={() => setHoverRating(value)}
                onClick={() => rate(value)}
                aria-label={`${value} star${value > 1 ? 's' : ''}`}
                role="radio"
                aria-checked={rating.mine === value}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            );
          })}
        </div>
        <span className="recipe-page__rating-hint">
          {rating.count > 0
            ? `${rating.average.toFixed(1)} average · ${rating.count} rating${rating.count > 1 ? 's' : ''}`
            : 'No ratings yet'}
          {rating.mine ? ` · you rated ${rating.mine}/5` : ''}
        </span>
      </div>

      {/* Comments */}
      <h2 className="recipe-page__section-title">Comments</h2>
      <form className="recipe-page__comment-form" onSubmit={submitComment}>
        <textarea
          className="recipe-page__comment-input"
          rows="3"
          placeholder="Share a tip or how it turned out…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" className="recipe-page__comment-btn" disabled={posting}>
          {posting ? 'Posting…' : 'Post Comment'}
        </button>
      </form>

      <div className="recipe-page__comments">
        {comments.length === 0 ? (
          <p className="recipe-page__comments-empty">No comments yet — be the first.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="recipe-page__comment">
              <div className="recipe-page__comment-head">
                <span className="recipe-page__comment-author">{c.author}</span>
                {user && c.userId === user.id && (
                  <button
                    className="recipe-page__comment-delete"
                    onClick={() => removeComment(c.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="recipe-page__comment-text">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
