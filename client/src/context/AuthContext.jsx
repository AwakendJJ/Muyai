import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  const lastSyncedUidRef = useRef(null);
  const syncInFlightRef = useRef(null);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    lastSyncedUidRef.current = null;
  }, []);

  const syncUser = useCallback(async (firebaseUser, body = {}) => {
    if (syncInFlightRef.current) {
      return syncInFlightRef.current;
    }

    const syncPromise = (async () => {
      const idToken = await firebaseUser.getIdToken();
      const response = await authApi.syncUser(idToken, body);
      setToken(idToken);
      setUser(response.data.user);
      lastSyncedUidRef.current = firebaseUser.uid;
      return response.data.user;
    })();

    syncInFlightRef.current = syncPromise;

    try {
      return await syncPromise;
    } finally {
      syncInFlightRef.current = null;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    clearSession();
  }, [clearSession]);

  const register = useCallback(async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await syncUser(credential.user, { name });
    await signOut(auth);
    clearSession();
    return { email };
  }, [clearSession, syncUser]);

  const registerWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    await syncUser(credential.user);
    await signOut(auth);
    clearSession();
    return { email: credential.user.email };
  }, [clearSession, syncUser]);

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

      if (!firebaseUser) {
        clearSession();
        setAuthReady(true);
        setLoading(false);
        return;
      }

      if (firebaseUser.uid === lastSyncedUidRef.current) {
        setAuthReady(true);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        await syncUser(firebaseUser);
      } catch (error) {
        console.error('Auth sync failed:', error);
        const message = error?.message || '';
        const isAuthError =
          message.includes('Authentication required') ||
          message.includes('Invalid or expired') ||
          message.includes('auth/');

        if (isAuthError) {
          await signOut(auth);
          clearSession();
        }
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
