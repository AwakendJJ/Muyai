import { Link } from 'react-router-dom';
import PlanBadge from '../components/PlanBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-svh bg-muted">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold">Muyai</Link>
          <div className="flex items-center gap-4">
            <PlanBadge plan={user?.plan} />
            <button type="button" onClick={logout} className="text-sm font-medium text-gray-text hover:text-dark">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="mt-2 text-gray-text">
          Your dashboard is ready. Resume upload and skill analysis coming in Phase 3.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="card-rounded p-6">
            <p className="text-sm text-gray-text">Plan</p>
            <p className="mt-1 text-xl font-bold capitalize">{user?.plan}</p>
          </div>
          <div className="card-rounded p-6">
            <p className="text-sm text-gray-text">Email</p>
            <p className="mt-1 text-xl font-bold">{user?.email}</p>
          </div>
          <div className="card-rounded p-6">
            <p className="text-sm text-gray-text">Role</p>
            <p className="mt-1 text-xl font-bold capitalize">{user?.role}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
