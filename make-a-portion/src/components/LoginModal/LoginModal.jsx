import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';

export default function LoginModal() {
  const { loginOpen, closeLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!loginOpen) return null;

  function reset() {
    setEmail('');
    setPassword('');
    setError('');
  }

  function handleClose() {
    reset();
    closeLogin();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError('Invalid email or password');
      return;
    }

    // Logged in — AuthProvider picks up the new session automatically
    reset();
    closeLogin();
  }

  return (
    <div className="auth-modal__overlay" onClick={handleClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-modal__close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        <h2 className="auth-modal__title">Log in to continue</h2>
        <p className="auth-modal__subtitle">You need an account to do that.</p>

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          <div className="auth-modal__field">
            <label className="auth-modal__label" htmlFor="modal-email">Email Address</label>
            <input
              className="auth-modal__input"
              id="modal-email"
              type="email"
              placeholder="chef@kitchenscale.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-modal__field">
            <label className="auth-modal__label" htmlFor="modal-password">Password</label>
            <input
              className="auth-modal__input"
              id="modal-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-modal__error">{error}</p>}

          <button className="auth-modal__btn" type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="auth-modal__footer">
          Don't have an account?{' '}
          <Link to="/register" onClick={handleClose}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
