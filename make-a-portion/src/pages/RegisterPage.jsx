import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './LoginPage.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate('/');
  }

  return (
    <div className="login">

      {/* Left — form panel */}
      <div className="login__form-panel">
        <div className="login__card">

          <div className="login__logo">
            <span className="login__logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 3a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm0 18a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM3 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm18 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM6.22 4.81a1 1 0 1 0-1.41 1.41 1 1 0 0 0 1.41-1.41zm12.57 12.57a1 1 0 1 0-1.41 1.41 1 1 0 0 0 1.41-1.41zM4.81 17.78a1 1 0 1 0 1.41 1.41 1 1 0 0 0-1.41-1.41zM17.38 5.22a1 1 0 1 0 1.41 1.41 1 1 0 0 0-1.41-1.41z"/>
              </svg>
            </span>
            <span className="login__logo-text">Make A Portion</span>
          </div>

          <div>
            <h1 className="login__heading">Create your account</h1>
            <p className="login__subheading">Sign up to start managing your recipes.</p>
          </div>

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__field">
              <label className="login__label" htmlFor="email">Email Address</label>
              <div className="login__input-wrap">
                <span className="login__input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  className="login__input"
                  id="email"
                  type="email"
                  placeholder="chef@kitchenscale.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="password">Password</label>
              <div className="login__input-wrap">
                <span className="login__input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  className="login__input"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="login__error">{error}</p>}

            <button className="login__btn" type="submit" disabled={loading}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>

          <p className="login__footer">
            Already have an account?{' '}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right — image panel */}
      <div className="login__image-panel">
        <img
          className="login__image"
          src="https://placehold.co/900x1080"
          alt="A beautifully arranged kitchen scene"
        />
        <div className="login__image-overlay" />
        <div className="login__image-text">
          <p className="login__tagline">Elevate every recipe.</p>
          <p className="login__tagline-sub">Precision management for the modern culinary creator.</p>
        </div>
      </div>
    </div>
  );
}
