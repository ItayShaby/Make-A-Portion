import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import AiAssistant from '../AiAssistant/AiAssistant';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      {sidebarOpen && (
        <div className="layout__backdrop" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout__main">
        <TopBar onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
      <AiAssistant />
    </div>
  );
}
