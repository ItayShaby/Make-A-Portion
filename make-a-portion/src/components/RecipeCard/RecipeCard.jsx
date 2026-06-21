import './RecipeCard.css';

export default function RecipeCard({ image, title, category, time, author, rating, favorite, onToggleFavorite }) {
  function handleFav(e) {
    // Stop the click from following the surrounding card link.
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.();
  }

  return (
    <article className="recipe-card">
      <div className="recipe-card__image-wrap">
        <img
          className="recipe-card__image"
          src={image || 'https://placehold.co/400x300?text=Recipe'}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x300?text=Recipe';
          }}
        />
        {onToggleFavorite && (
          <button
            type="button"
            className={`recipe-card__fav${favorite ? ' recipe-card__fav--active' : ''}`}
            onClick={handleFav}
            aria-label={favorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <svg viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>

      <div className="recipe-card__body">
        {category && (
          <span className="recipe-card__chip">{category}</span>
        )}

        <h3 className="recipe-card__title">{title}</h3>

        <div className="recipe-card__meta">
          <span className="recipe-card__author">{author}</span>

          <div className="recipe-card__info">
            {time && (
              <span className="recipe-card__time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {time}
              </span>
            )}

            {rating && (
              <span className="recipe-card__rating">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
