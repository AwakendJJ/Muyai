import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Separator } from '../components/ui/separator.jsx';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function Login() {
  const { login, loginWithGoogle, isAuthenticated, authReady, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/apps/dashboard';
  const successMessage = location.state?.message;

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authReady && !loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh">
      <div className="hidden w-1/2 bg-gradient-to-br from-purple via-pink to-blue lg:flex lg:flex-col lg:justify-center lg:p-12">
        <p className="text-3xl font-bold text-white">Muyai</p>
        <h2 className="mt-6 text-4xl font-bold leading-tight text-white">
          Elevate your career with AI
        </h2>
        <p className="mt-4 max-w-md text-white/80">
          Upload your resume, discover your skills, and get personalized career guidance built for African talent.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-muted px-6 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center lg:hidden">
              <Link to="/" className="text-2xl font-bold">Muyai</Link>
            </div>
            <h1 className="mt-2 text-center text-2xl font-bold lg:mt-0 lg:text-left">Welcome back</h1>
            <p className="mt-2 text-center text-sm text-gray-text lg:text-left">
              Sign in to continue your career journey
            </p>

            <div className="mt-8 space-y-4">
              {successMessage && (
                <div className="rounded-xl border border-purple/20 bg-purple/10 px-4 py-3 text-sm text-purple">
                  {successMessage}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogle}
                disabled={submitting}
              >
                <GoogleIcon />
                Continue with Google
              </Button>

              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-text">or</span>
                <Separator className="flex-1" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <ErrorBanner message={error} />}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple focus:ring-2 focus:ring-purple/20"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple focus:ring-2 focus:ring-purple/20"
                    placeholder="Your password"
                  />
                </div>

                <Button type="submit" variant="default" className="w-full" disabled={submitting}>
                  {submitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-gray-text">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-purple hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
