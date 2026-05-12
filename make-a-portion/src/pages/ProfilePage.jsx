import { useState } from 'react';
import './ProfilePage.css';

export default function ProfilePage() {
  const [tempUnit, setTempUnit] = useState('celsius');
  const [scaleSync, setScaleSync] = useState(false);

  return (
    <div className="profile">

      {/* Header */}
      <div className="profile__header">
        <div className="profile__avatar">U</div>

        <div className="profile__info">
          <h1 className="profile__name">User Name</h1>
          <p className="profile__role">Home Cook</p>
          <div className="profile__badges">
            <span className="profile__badge profile__badge--premium">★ Premium</span>
            <span className="profile__badge profile__badge--verified">✓ Verified</span>
          </div>
        </div>

        <button className="profile__edit-btn">Edit Profile</button>
      </div>

      {/* Kitchen Preferences */}
      <div className="profile__section">
        <h2 className="profile__section-title">Kitchen Preferences</h2>

        <div className="profile__row">
          <span className="profile__row-label">Measurement System</span>
          <select className="profile__select" defaultValue="metric">
            <option value="metric">Metric</option>
            <option value="imperial">Imperial</option>
          </select>
        </div>

        <div className="profile__row">
          <span className="profile__row-label">Temperature Unit</span>
          <div className="profile__segment">
            <button
              className={`profile__segment-btn${tempUnit === 'celsius' ? ' profile__segment-btn--active' : ''}`}
              onClick={() => setTempUnit('celsius')}
            >
              °C Celsius
            </button>
            <button
              className={`profile__segment-btn${tempUnit === 'fahrenheit' ? ' profile__segment-btn--active' : ''}`}
              onClick={() => setTempUnit('fahrenheit')}
            >
              °F Fahrenheit
            </button>
          </div>
        </div>

        <div className="profile__row">
          <span className="profile__row-label">Smart Scale Sync</span>
          <label className="profile__toggle">
            <input
              type="checkbox"
              checked={scaleSync}
              onChange={(e) => setScaleSync(e.target.checked)}
            />
            <span className="profile__toggle-track" />
            <span className="profile__toggle-thumb" />
          </label>
        </div>
      </div>

      {/* Account Details */}
      <div className="profile__section">
        <h2 className="profile__section-title">Account Details</h2>

        <div className="profile__field">
          <label className="profile__field-label" htmlFor="profile-email">Email</label>
          <input
            className="profile__field-input"
            id="profile-email"
            type="email"
            defaultValue="user@example.com"
          />
        </div>

        <div className="profile__field">
          <label className="profile__field-label" htmlFor="profile-password">Password</label>
          <input
            className="profile__field-input"
            id="profile-password"
            type="password"
            defaultValue="••••••••"
          />
        </div>
      </div>

    </div>
  );
}
