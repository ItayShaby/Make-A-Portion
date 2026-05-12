import { useState } from 'react';
import './RecipePage.css';

const BASE_SERVINGS = 4;

const RECIPE = {
  title: 'Lemon Herb Roast Chicken',
  category: 'Main Course',
  description:
    'A classic Sunday roast elevated with bright lemon zest, fresh thyme, and garlic butter tucked under the skin. The result is a golden, juicy bird with crispy skin and a fragrant pan sauce that begs for crusty bread.',
  image: 'https://placehold.co/1200x500',
  ingredients: [
    { name: 'Whole chicken', baseQty: 1.5, metricUnit: 'kg', imperialQty: 3.3, imperialUnit: 'lb' },
    { name: 'Lemon', baseQty: 2, metricUnit: '', imperialQty: 2, imperialUnit: '' },
    { name: 'Garlic cloves', baseQty: 6, metricUnit: '', imperialQty: 6, imperialUnit: '' },
    { name: 'Butter', baseQty: 60, metricUnit: 'g', imperialQty: 2.1, imperialUnit: 'oz' },
    { name: 'Fresh thyme', baseQty: 10, metricUnit: 'g', imperialQty: 0.35, imperialUnit: 'oz' },
    { name: 'Olive oil', baseQty: 30, metricUnit: 'ml', imperialQty: 1, imperialUnit: 'fl oz' },
    { name: 'Salt', baseQty: 8, metricUnit: 'g', imperialQty: 0.28, imperialUnit: 'oz' },
    { name: 'Black pepper', baseQty: 3, metricUnit: 'g', imperialQty: 0.1, imperialUnit: 'oz' },
  ],
};

function formatQty(value) {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
}

export default function RecipePage() {
  const [servings, setServings] = useState(BASE_SERVINGS);
  const [unit, setUnit] = useState('metric');

  const ratio = servings / BASE_SERVINGS;

  return (
    <div className="recipe-page">
      <img
        className="recipe-page__cover"
        src={RECIPE.image}
        alt={RECIPE.title}
      />

      <div className="recipe-page__header">
        <span className="recipe-page__category">{RECIPE.category}</span>
        <h1 className="recipe-page__title">{RECIPE.title}</h1>
        <p className="recipe-page__description">{RECIPE.description}</p>
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
            className={`recipe-page__unit-btn${unit === 'metric' ? ' recipe-page__unit-btn--active' : ''}`}
            onClick={() => setUnit('metric')}
          >
            Metric
          </button>
          <button
            className={`recipe-page__unit-btn${unit === 'imperial' ? ' recipe-page__unit-btn--active' : ''}`}
            onClick={() => setUnit('imperial')}
          >
            Imperial
          </button>
        </div>
      </div>

      <h2 className="recipe-page__section-title">Ingredients</h2>
      <div className="recipe-page__ingredients">
        {RECIPE.ingredients.map((ing) => {
          const qty = unit === 'metric'
            ? formatQty(ing.baseQty * ratio)
            : formatQty(ing.imperialQty * ratio);
          const unitLabel = unit === 'metric' ? ing.metricUnit : ing.imperialUnit;

          return (
            <div key={ing.name} className="recipe-page__ingredient">
              <span className="recipe-page__ingredient-name">{ing.name}</span>
              <span className="recipe-page__ingredient-qty">
                {qty}{unitLabel ? ` ${unitLabel}` : ''}
              </span>
            </div>
          );
        })}
      </div>

      <button className="recipe-page__cta">Start Cooking</button>
    </div>
  );
}
