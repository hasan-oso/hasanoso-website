import {
  signInWithEmailAndPassword as fbSignInEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { ADMIN_EMAIL, getFirebaseAuth } from './config';

/**
 * Single-admin gate. Returns true only for the configured admin email.
 *
 * Firestore rules MUST also enforce this — never trust the client alone.
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  if (!user.email) return false;
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Signs in with email and password. Throws if Firebase isn't configured.
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase auth is not configured.');
  const result = await fbSignInEmail(auth, email, password);
  return result.user;
}

/** Signs the current user out. No-op when Firebase isn't configured. */
export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await fbSignOut(auth);
}

/**
 * Subscribes to auth state changes. Returns an unsubscribe function.
 * Safe to call when Firebase isn't configured (returns a no-op unsubscribe).
 */
export function subscribeToAuth(
  callback: (user: User | null) => void,
): Unsubscribe {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

