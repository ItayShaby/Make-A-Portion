import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipesContext';
import { supabase } from '../lib/supabase';
import { saveRecipeIngredients, getRecipeIngredients, uploadImage } from '../lib/db';
import './AddRecipePage.css';

// Unique row ids — a counter avoids the Date.now() collision when several
// rows are created in the same tick.
let rowSeq = 0;
const EMPTY_ROW = () => ({ id: `ing-${rowSeq++}`, name: '', quantity: '', unit: '' });

const FALLBACK_CATEGORIES = ['Breakfast', 'Main Course', 'Desserts', 'Quick'];

export default function AddRecipePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const { user } = useAuth();
  const { recipes, refresh, categories } = useRecipes();

  const categoryOptions = categories.length ? categories : FALLBACK_CATEGORIES;

  // Start with a single ingredient row by default.
  const [rows, setRows] = useState([EMPTY_ROW()]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // In edit mode, pre-fill the form with the recipe's current values.
  useEffect(() => {
    if (!editing) return;

    async function load() {
      // Prefer the already-loaded recipe from context; otherwise fetch it.
      let recipe = recipes.find((r) => r.id === id);
      if (!recipe) {
        const { data } = await supabase
          .from('Recipe')
          .select('*')
          .eq('id', id)
          .single();
        if (data) {
          recipe = {
            title: data.title,
            category: data.category,
            prepTime: data.prep_time,
            baseServings: data.base_servings,
            instructions: data.instructions || '',
          };
        }
      }
      if (recipe) {
        setName(recipe.title || '');
        setCategory(recipe.category || 'Main Course');
        setPrepTime(recipe.prepTime != null ? String(recipe.prepTime) : '');
        setServings(recipe.baseServings != null ? String(recipe.baseServings) : '');
        setInstructions(recipe.instructions || '');
      }

      // Load the recipe's existing ingredient rows.
      try {
        const ings = await getRecipeIngredients(id);
        if (ings.length) {
          setRows(ings.map((ing) => ({
            id: `ing-${rowSeq++}`,
            name: ing.name,
            quantity: ing.quantity != null ? String(ing.quantity) : '',
            unit: ing.unit || '',
          })));
        }
      } catch (err) {
        console.error('Failed to load ingredients:', err);
      }
    }
    load();
  }, [editing, id, recipes]);

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

  async function handleCover(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setError('');
    setCoverImage(URL.createObjectURL(file)); // instant local preview
    setUploadingCover(true);
    try {
      const url = await uploadImage('Recipe-img', user.id, file);
      setCoverImage(url); // real public URL
    } catch (err) {
      console.error('Cover upload failed:', err);
      setError('Cover image upload failed. You can still save without a photo.');
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Parse the prep time text (e.g. "30 min") into a number of minutes.
    const prepMinutes = parseInt(prepTime, 10);

    const payload = {
      title: name.trim() || 'Untitled Recipe',
      category,
      prep_time: Number.isNaN(prepMinutes) ? null : prepMinutes,
      base_servings: servings ? Number(servings) : 4,
      instructions: instructions.trim() || null,
    };
    // Only set the cover when a real uploaded URL exists, so editing without
    // choosing a new photo doesn't wipe the existing one.
    if (coverImage && !coverImage.startsWith('blob:')) {
      payload.cover_img_url = coverImage;
    }

    // Update the existing recipe, or insert a new one owned by the user.
    let recipeId = id;
    let saveError;
    if (editing) {
      const { error } = await supabase.from('Recipe').update(payload).eq('id', id);
      saveError = error;
    } else {
      const { data, error } = await supabase
        .from('Recipe')
        .insert({ ...payload, user_id: user.id, is_public: true })
        .select('id')
        .single();
      saveError = error;
      recipeId = data?.id;
    }

    if (saveError) {
      setSaving(false);
      console.error('Failed to save recipe:', saveError);
      setError('Could not save the recipe. Please try again.');
      return;
    }

    // Save the ingredient list (find-or-create ingredients + replace junction rows).
    try {
      await saveRecipeIngredients(recipeId, rows);
    } catch (err) {
      setSaving(false);
      console.error('Failed to save ingredients:', err);
      setError('The recipe was saved, but its ingredients failed. Try editing it again.');
      return;
    }

    setSaving(false);

    // Refresh the shared list, then land on My Recipes so it's visible.
    await refresh();
    navigate('/my-recipes');
  }

  return (
    <div className="add-recipe">
      <h1 className="add-recipe__title">{editing ? 'Edit Recipe' : 'Add New Recipe'}</h1>

      {/* Upload zone */}
      <div
        className="add-recipe__upload"
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {coverImage ? (
          <img className="add-recipe__upload-preview" src={coverImage} alt="Cover preview" />
        ) : (
          <>
            <svg className="add-recipe__upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="add-recipe__upload-label">
              {uploadingCover ? 'Uploading…' : 'Click to upload a cover photo'}
            </span>
            <span className="add-recipe__upload-hint">PNG, JPG up to 10 MB</span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleCover}
        />
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
            <div className="add-recipe__field">
              <label className="add-recipe__label" htmlFor="prep-time">Prep Time (minutes)</label>
              <input
                className="add-recipe__input"
                id="prep-time"
                type="text"
                placeholder="e.g. 30"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>
            <div className="add-recipe__field">
              <label className="add-recipe__label" htmlFor="category">Category</label>
              <select
                className="add-recipe__input"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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
                type="number"
                step="any"
                min="0"
                placeholder="Qty"
                value={row.quantity}
                onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
              />
              <input
                className="add-recipe__input"
                type="text"
                placeholder="Unit"
                value={row.unit}
                onChange={(e) => updateRow(row.id, 'unit', e.target.value)}
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

        {/* Preparation / Instructions */}
        <div className="add-recipe__section">
          <h2 className="add-recipe__section-title">Preparation</h2>
          <div className="add-recipe__field">
            <label className="add-recipe__label" htmlFor="instructions">How to prepare it</label>
            <textarea
              className="add-recipe__textarea"
              id="instructions"
              rows="6"
              placeholder="Step 1: Preheat the oven to 200°C…&#10;Step 2: …"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="add-recipe__error">{error}</p>}

        <button type="submit" className="add-recipe__save-btn" disabled={saving || uploadingCover}>
          {saving ? 'Saving…' : editing ? 'Save Changes' : 'Save Recipe'}
        </button>
      </form>
    </div>
  );
}
