import { Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  return (
    <div className="login">
      <div className="login__card">
        <div className="login__logo">
          <p className="login__logo-title">Make A Portion</p>
          <p className="login__logo-sub">Recipe Management</p>
        </div>

        <h1 className="login__heading">Welcome back</h1>

        <form className="login__form" onSubmit={(e) => e.preventDefault()}>
          <div className="login__field">
            <label className="login__label" htmlFor="email">Email</label>
            <input
              className="login__input"
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="password">Password</label>
            <input
              className="login__input"
              id="password"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button className="login__btn" type="submit">
            Log In
          </button>
        </form>

        <p className="login__footer">
          Don't have an account?{' '}
          <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
