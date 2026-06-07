import { NavLink } from 'react-router-dom';
import PlanBadge from '../PlanBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/resume', label: 'Resume', icon: '📄' },
  { to: '/analysis', label: 'Analysis', icon: '🔍' },
  { to: '/recommendations', label: 'Recommendations', icon: '🎯' },
];

function NavItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-purple/10 text-purple'
            : 'text-gray-text hover:bg-muted hover:text-dark'
        }`
      }
    >
      <span>{icon}</span>
      {label}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full flex-col bg-white px-4 py-6">
      <div className="px-4">
        <p className="text-xl font-bold">Muyai</p>
        <div className="mt-3">
          <PlanBadge plan={user?.plan} />
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_LINKS.map((link) => (
          <NavItem key={link.to} {...link} onClick={onNavigate} />
        ))}
        {user?.role === 'admin' && (
          <NavItem to="/admin" label="Admin" icon="⚙️" onClick={onNavigate} />
        )}
      </nav>

      <div className="mt-auto border-t border-gray-100 px-4 pt-6">
        <p className="truncate text-sm font-medium">{user?.name}</p>
        <p className="truncate text-xs text-gray-text">{user?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 w-full rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-text hover:bg-muted hover:text-dark"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
