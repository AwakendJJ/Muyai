import { Link, NavLink } from 'react-router-dom';
import PlanBadge from '../PlanBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/resume', label: 'Resume' },
  { to: '/analysis', label: 'Analysis' },
  { to: '/recommendations', label: 'Recommendations' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-svh bg-muted">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-xl font-bold">Muyai</Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-purple' : 'text-gray-text hover:text-dark'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-pink' : 'text-gray-text hover:text-dark'}`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <PlanBadge plan={user?.plan} />
            <button
              type="button"
              onClick={logout}
              className="text-sm font-medium text-gray-text hover:text-dark"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
