import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let initialized = false;

export function initFirebaseAdmin() {
  if (initialized || getApps().length > 0) {
    initialized = true;
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin not configured — auth will fail until FIREBASE_* env vars are set');
    return null;
  }

  const app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  initialized = true;
  return app;
}

export function getFirebaseAdmin() {
  return initFirebaseAdmin();
}

export async function verifyIdToken(token) {
  const app = getFirebaseAdmin();
  if (!app) {
    throw new Error('Firebase Admin is not configured');
  }
  return getAuth(app).verifyIdToken(token);
}
