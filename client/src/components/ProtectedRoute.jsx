import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, authReady } = useAuth();
  const location = useLocation();

  if (!authReady || loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
