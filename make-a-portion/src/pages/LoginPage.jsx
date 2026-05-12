import { Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
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
            <h1 className="login__heading">Welcome back</h1>
            <p className="login__subheading">Please enter your details to access your collection.</p>
          </div>

          <form className="login__form" onSubmit={(e) => e.preventDefault()}>
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
                />
              </div>
            </div>

            <div className="login__field">
              <div className="login__field-row">
                <label className="login__label" htmlFor="password">Password</label>
                <a href="#" className="login__forgot">Forgot password?</a>
              </div>
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
                />
              </div>
            </div>

            <button className="login__btn" type="submit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Login
            </button>
          </form>

          <div className="login__divider">or continue with</div>

          <button className="login__google-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="login__footer">
            Don't have an account?{' '}
            <Link to="/register">Sign up for free</Link>
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
