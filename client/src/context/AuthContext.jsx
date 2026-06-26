import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase.js';
import * as authApi from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const syncUser = useCallback(async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();
    const response = await authApi.syncUser(idToken);
    setToken(idToken);
    setUser(response.data.user);
    return response.data.user;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    clearSession();
  }, [clearSession]);

  const register = useCallback(async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await credential.user.getIdToken();
    await authApi.syncUser(idToken, { name });
    await signOut(auth);
    clearSession();
    return { email };
  }, [clearSession]);

  const registerWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    const idToken = await credential.user.getIdToken();
    await authApi.syncUser(idToken);
    await signOut(auth);
    clearSession();
    return { email: credential.user.email };
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return syncUser(credential.user);
  }, [syncUser]);

  const loginWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    return syncUser(credential.user);
  }, [syncUser]);

  const getToken = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) return null;
    const idToken = await current.getIdToken();
    setToken(idToken);
    return idToken;
  }, []);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return;

      setLoading(true);

      if (!firebaseUser) {
        clearSession();
        setAuthReady(true);
        setLoading(false);
        return;
      }

      try {
        await syncUser(firebaseUser);
      } catch (error) {
        console.error('Auth sync failed:', error);
        await signOut(auth);
        clearSession();
      } finally {
        if (active) {
          setAuthReady(true);
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [syncUser, clearSession]);

  const isAuthenticated = authReady && !!auth.currentUser && !!user && !!token;

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      authReady,
      register,
      registerWithGoogle,
      login,
      loginWithGoogle,
      logout,
      getToken,
      isAuthenticated,
    }),
    [user, token, loading, authReady, register, registerWithGoogle, login, loginWithGoogle, logout, getToken, isAuthenticated]
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
