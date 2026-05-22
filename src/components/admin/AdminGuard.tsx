'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { ADMIN_EMAIL } from '@/lib/firebase/config';

/**
 * Route gate for everything under /admin (except /admin/login).
 *
 * - Shows a calm loading state while Firebase auth resolves.
 * - Redirects to /admin/login when there's no signed-in user.
 * - Refuses access (no redirect) when signed in but not the admin email,
 *   so the user can see *why* they were denied and sign out.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? '';

  // Bypass the guard on the login page itself.
  const onLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

  useEffect(() => {
    if (onLoginPage) return;
    if (!auth.ready) return;
    if (!auth.configured) return;
    if (!auth.user) {
      router.replace('/admin/login');
    }
  }, [onLoginPage, auth.ready, auth.user, auth.configured, router]);

  if (onLoginPage) return <>{children}</>;

  if (!auth.configured) {
    return <ConfigErrorScreen />;
  }
  if (!auth.ready) {
    return <LoadingScreen />;
  }
  if (!auth.user) {
    return <LoadingScreen />;
  }
  if (!auth.isAdmin) {
    return <DeniedScreen email={auth.user.email} />;
  }
  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-void-0">
      <p className="text-text-faint text-xs font-mono uppercase tracking-[0.3em]">
        Authenticating…
      </p>
    </div>
  );
}

function ConfigErrorScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-void-0 px-6">
      <div className="max-w-md rounded-md border border-red-500/40 bg-void-1 p-6 text-center">
        <p className="text-red-400 text-xs font-mono uppercase tracking-[0.3em]">
          Firebase not configured
        </p>
        <p className="mt-3 text-text-muted text-sm">
          Set the NEXT_PUBLIC_FIREBASE_* env vars in .env.local and restart.
        </p>
      </div>
    </div>
  );
}

function DeniedScreen({ email }: { email: string | null }) {
  const auth = useAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-void-0 px-6">
      <div className="max-w-md rounded-md border border-void-3 bg-void-1 p-6 text-center">
        <p className="text-red-400 text-xs font-mono uppercase tracking-[0.3em]">
          Access denied
        </p>
        <p className="mt-3 text-text-muted text-sm">
          You're signed in as{' '}
          <span className="text-text-bright keep-latin">{email ?? '—'}</span>,
          but this dashboard is restricted to{' '}
          <span className="text-text-bright keep-latin">{ADMIN_EMAIL}</span>.
        </p>
        <button
          type="button"
          onClick={() => auth.signOut()}
          className="mt-6 inline-flex items-center gap-2 rounded-sm border border-gold-core px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-gold-core hover:bg-gold-core hover:text-void-0 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
