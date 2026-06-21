/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ensureUserProfile, getUserProfile } from '../lib/db';

const AuthContext = createContext(null);

// Build the display profile from the auth user + the Users table row.
function buildProfile(user, row) {
  if (!user) return null;
  const fullName = (row?.['full name'] || '').trim();
  const parts = fullName ? fullName.split(' ') : [];
  const emailName = (user.email ?? '').split('@')[0];
  return {
    fullName,
    firstName: parts[0] || emailName || '',
    lastName: parts.slice(1).join(' ') || '',
    avatarUrl: row?.avatar_url || '',
    email: row?.email || user.email || '',
    measurementSystem: row?.measurement_system || 'metric',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  // Make sure a Users row exists, then load it into the profile.
  async function loadProfile(u) {
    if (!u) {
      setProfile(null);
      return;
    }
    try {
      await ensureUserProfile(u);
      const row = await getUserProfile(u.id);
      setProfile(buildProfile(u, row));
    } catch (err) {
      console.error('Failed to load profile:', err);
      setProfile(buildProfile(u, null));
    }
  }

  useEffect(() => {
    // Read the current session on first load
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      setLoading(false);
      loadProfile(u);
    });

    // Keep the user in sync on login / logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      loadProfile(u);
    });

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload the profile from the database (call after saving the Edit Profile form).
  async function refreshProfile() {
    if (user) await loadProfile(user);
  }

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
    profile,
    refreshProfile,
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
