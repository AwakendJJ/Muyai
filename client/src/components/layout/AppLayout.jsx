import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import PlanBadge from '../PlanBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-muted">
      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 border-r border-gray-100 lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-dark/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-0 h-full w-72 shadow-xl">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/dashboard" className="text-lg font-bold">Muyai</Link>
          <PlanBadge plan={user?.plan} />
        </header>

        {/* Desktop top bar */}
        <header className="hidden items-center justify-between border-b border-gray-100 bg-white px-8 py-4 lg:flex">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-text">{user?.name}</span>
            <button
              type="button"
              onClick={logout}
              className="text-sm font-medium text-gray-text hover:text-dark"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
