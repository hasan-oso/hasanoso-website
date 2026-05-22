import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * Firebase client config — sourced from NEXT_PUBLIC_ env vars.
 *
 * These are PUBLIC keys, safe to ship in client bundles. Security is enforced
 * by Firestore security rules + the single-admin email gate in `auth.ts`.
 *
 * Never import the Firebase Admin SDK from this file or any client-reachable
 * module. Admin SDK belongs to scripts/build-time only.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

/** Single-admin email gate. Anyone else who signs in is denied. */
export const ADMIN_EMAIL = 'osohasan.ai@gmail.com';

/**
 * Returns true if the minimum config is present. Lets callers fall back
 * gracefully (e.g. on local dev without .env.local).
 */
export function hasFirebaseConfig(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

let cachedApp: FirebaseApp | null = null;

/** Lazily initialises and caches the Firebase app. Returns null if unconfigured. */
export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig()) return null;
  if (cachedApp) return cachedApp;
  if (getApps().length) {
    cachedApp = getApp();
  } else {
    cachedApp = initializeApp(firebaseConfig as Required<typeof firebaseConfig>);
  }
  return cachedApp;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getFirebaseApp();
  return app ? getStorage(app) : null;
}

/** Reads the configured project id. Useful for diagnostics / build logs. */
export function firebaseProjectId(): string | undefined {
  return firebaseConfig.projectId;
}
