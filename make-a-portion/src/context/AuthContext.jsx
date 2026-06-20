/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    // Read the current session on first load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Keep the user in sync on login / logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  function openLogin() {
    setLoginOpen(true);
  }

  function closeLogin() {
    setLoginOpen(false);
  }

  // Run `action` only if the user is logged in; otherwise open the login modal.
  function requireAuth(action) {
    if (user) {
      action?.();
      return true;
    }
    openLogin();
    return false;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const value = {
    user,
    loading,
    loginOpen,
    openLogin,
    closeLogin,
    requireAuth,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return ctx;
}
