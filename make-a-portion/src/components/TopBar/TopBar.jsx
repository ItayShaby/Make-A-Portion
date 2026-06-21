import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';
import './TopBar.css';

export default function TopBar({ onMenuClick }) {
  const { user, profile } = useAuth();
  const { searchTerm, setSearchTerm } = useRecipes();
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = profile?.firstName || '';
  const initial = firstName ? firstName[0].toUpperCase() : 'U';

  function handleSearch(e) {
    setSearchTerm(e.target.value);
    // Show results on the Discover page.
    if (location.pathname !== '/') navigate('/');
  }

  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="topbar__search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="topbar__search-input"
          type="text"
          placeholder="Search recipes..."
          aria-label="Search recipes"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="topbar__actions">
        {user && firstName && (
          <span className="topbar__greeting">Hi, {firstName}</span>
        )}

        <Link to="/profile" className="topbar__avatar" aria-label="Go to profile">
          {initial}
        </Link>
      </div>
    </header>
  );
}
