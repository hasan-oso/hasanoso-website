'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, hasFirebaseConfig } from '@/lib/firebase/config';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  configured: false,
  signIn: async () => {
    throw new Error('Firebase is not configured.');
  },
  signOut: async () => {},
});

const INACTIVITY_KEY = 'hasanoso_admin_last_active';
const INACTIVITY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = hasFirebaseConfig();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(configured);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        const last = window.localStorage.getItem(INACTIVITY_KEY);
        const now = Date.now();
        if (last && now - Number(last) > INACTIVITY_LIMIT_MS) {
          firebaseSignOut(auth).catch(() => undefined);
          window.localStorage.removeItem(INACTIVITY_KEY);
        } else {
          window.localStorage.setItem(INACTIVITY_KEY, String(now));
        }
      } else {
        window.localStorage.removeItem(INACTIVITY_KEY);
      }
    });
    return () => unsubscribe();
  }, [configured]);

  useEffect(() => {
    if (!user) return;
    const update = () => {
      try {
        window.localStorage.setItem(INACTIVITY_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    };
    const winEvents = ['click', 'keydown', 'scroll'] as const;
    winEvents.forEach((e) =>
      window.addEventListener(e, update, { passive: true }),
    );
    document.addEventListener('visibilitychange', update);
    return () => {
      winEvents.forEach((e) => window.removeEventListener(e, update));
      document.removeEventListener('visibilitychange', update);
    };
  }, [user]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error(
          'Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars.',
        );
      }
      await signInWithEmailAndPassword(auth, email, password);
    },
    [],
  );

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo(
    () => ({ user, loading, configured, signIn, signOut }),
    [user, loading, configured, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
