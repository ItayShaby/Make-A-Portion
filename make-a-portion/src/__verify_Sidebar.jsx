import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <button className="sidebar__signout" onClick={handleSignOut}>
        Sign Out
      </button>
      <NavLink to="/" onClick={onClose}>Dashboard</NavLink>
    </aside>
  );
}
