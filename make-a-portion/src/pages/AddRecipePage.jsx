import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRecipePage.css';

const EMPTY_ROW = () => ({ id: Date.now(), name: '', quantity: '' });

export default function AddRecipePage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);

  function addRow() {
    setRows((prev) => [...prev, EMPTY_ROW()]);
  }

  function deleteRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRow(id, field, value) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  function handleSave(e) {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className="add-recipe">
      <h1 className="add-recipe__title">Add New Recipe</h1>

      {/* Upload zone */}
      <div className="add-recipe__upload">
        <svg className="add-recipe__upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span className="add-recipe__upload-label">Click or drag to upload a cover photo</span>
        <span className="add-recipe__upload-hint">PNG, JPG up to 10 MB</span>
      </div>

      <form onSubmit={handleSave}>
        {/* General info */}
        <div className="add-recipe__section">
          <h2 className="add-recipe__section-title">General Info</h2>
          <div className="add-recipe__info-grid">
            <div className="add-recipe__field">
              <label className="add-recipe__label" htmlFor="recipe-name">Recipe Name</label>
              <input
                className="add-recipe__input"
                id="recipe-name"
                type="text"
                placeholder="e.g. Lemon Herb Roast Chicken"
              />
            </div>
            <div className="add-recipe__field">
              <label className="add-recipe__label" htmlFor="servings">Initial Servings</label>
              <input
                className="add-recipe__input"
                id="servings"
                type="number"
                min="1"
                placeholder="4"
              />
            </div>
            <div className="add-recipe__field">
              <label className="add-recipe__label" htmlFor="prep-time">Prep Time</label>
              <input
                className="add-recipe__input"
                id="prep-time"
                type="text"
                placeholder="e.g. 30 min"
              />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="add-recipe__section">
          <div className="add-recipe__table-header">
            <h2 className="add-recipe__section-title add-recipe__section-title--flush">Ingredients</h2>
            <span className="add-recipe__badge">Dynamic Scaling Ready</span>
          </div>

          {rows.map((row) => (
            <div key={row.id} className="add-recipe__ing-row">
              <input
                className="add-recipe__input"
                type="text"
                placeholder="Ingredient name"
                value={row.name}
                onChange={(e) => updateRow(row.id, 'name', e.target.value)}
              />
              <input
                className="add-recipe__input"
                type="text"
                placeholder="Qty + unit"
                value={row.quantity}
                onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
              />
              <button
                type="button"
                className="add-recipe__delete-btn"
                onClick={() => deleteRow(row.id)}
                aria-label="Remove ingredient"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          ))}

          <button type="button" className="add-recipe__add-row-btn" onClick={addRow}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Ingredient
          </button>
        </div>

        <button type="submit" className="add-recipe__save-btn">Save Recipe</button>
      </form>
    </div>
  );
}
