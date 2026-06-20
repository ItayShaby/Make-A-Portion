import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading, openLogin } = useAuth();

  // If a guest lands on a protected URL directly, open the login popup
  useEffect(() => {
    if (!loading && !user) {
      openLogin();
    }
  }, [loading, user, openLogin]);

  if (loading) {
    return <p style={{ padding: '2rem' }}>Loading…</p>;
  }

  // Guests get sent back to the public landing page (the popup handles login)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
