'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import {
  isAdmin,
  signInWithGoogle,
  signOut,
  subscribeToAuth,
} from '@/lib/firebase/auth';
import { hasFirebaseConfig } from '@/lib/firebase/config';

type AuthState = {
  user: User | null;
  loading: boolean;
  ready: boolean;
  isAdmin: boolean;
  configured: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = hasFirebaseConfig();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      setReady(true);
      return;
    }
    const unsub = subscribeToAuth((u) => {
      setUser(u);
      setLoading(false);
      setReady(true);
    });
    return unsub;
  }, [configured]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      ready,
      isAdmin: isAdmin(user),
      configured,
      error,
      async signIn() {
        setError(null);
        try {
          await signInWithGoogle();
        } catch (e) {
          console.error('signIn failed', e);
          setError(e instanceof Error ? e.message : 'Sign-in failed.');
        }
      },
      async signOut() {
        setError(null);
        await signOut();
      },
    }),
    [user, loading, ready, configured, error],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
