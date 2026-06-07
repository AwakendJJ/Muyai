import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'muyai_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const persistSession = useCallback((newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await authApi.register(name, email, password);
    persistSession(response.data.token, response.data.user);
    return response.data.user;
  }, [persistSession]);

  const login = useCallback(async (email, password) => {
    const response = await authApi.login(email, password);
    persistSession(response.data.token, response.data.user);
    return response.data.user;
  }, [persistSession]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authApi.getMe(token)
      .then((response) => setUser(response.data.user))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token, logout]);

  const value = useMemo(
    () => ({ user, token, loading, register, login, logout, isAuthenticated: !!user }),
    [user, token, loading, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
