import './TopBar.css';

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar__search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="topbar__search-input"
          type="text"
          placeholder="Search your recipes..."
          aria-label="Search recipes"
        />
      </div>

      <div className="topbar__actions">
        <button className="topbar__icon-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="topbar__badge" aria-hidden="true" />
        </button>

        <div className="topbar__avatar" aria-label="User profile">
          U
        </div>
      </div>
    </header>
  );
}
