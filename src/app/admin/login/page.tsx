'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/admin/AuthContext';
import { ADMIN_EMAIL } from '@/lib/firebase/config';

export default function AdminLoginPage() {
  const auth = useAuth();
  const router = useRouter();

  // If already authenticated (admin), bounce to dashboard
  useEffect(() => {
    if (auth.ready && auth.user && auth.isAdmin) {
      router.replace('/admin');
    }
  }, [auth.ready, auth.user, auth.isAdmin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-void-0 px-6">
      <div className="w-full max-w-md rounded-md border border-void-3 bg-void-1/60 p-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-gold-core/80">
          Admin
        </p>
        <h1 className="mt-4 text-2xl font-display text-text-bright">
          Sign in to continue
        </h1>
        <p className="mt-3 text-sm text-text-muted leading-relaxed">
          Restricted to{' '}
          <span className="text-text-bright keep-latin">{ADMIN_EMAIL}</span>.
          Other Google accounts will be denied.
        </p>

        {!auth.configured ? (
          <div className="mt-6 rounded-sm border border-red-500/40 bg-red-500/5 p-3 text-xs text-red-300">
            Firebase isn't configured in this environment. Set
            NEXT_PUBLIC_FIREBASE_* env vars and restart.
          </div>
        ) : auth.user && !auth.isAdmin ? (
          <div className="mt-6 rounded-sm border border-red-500/40 bg-red-500/5 p-3 text-xs text-red-300">
            Signed in as{' '}
            <span className="text-text-bright keep-latin">
              {auth.user.email}
            </span>
            . This account is not authorised.
            <button
              type="button"
              onClick={() => auth.signOut()}
              className="mt-3 block text-text-faint hover:text-text-bright transition-colors cursor-pointer"
            >
              Sign out →
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => auth.signIn()}
          disabled={!auth.configured || auth.loading}
          className="mt-8 w-full rounded-sm border border-gold-core bg-gold-core text-void-0 py-3 text-sm font-medium tracking-wide hover:bg-gold-warm hover:border-gold-warm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {auth.loading ? 'Loading…' : 'Continue with Google'}
        </button>

        {auth.error ? (
          <p className="mt-4 text-xs text-red-400">{auth.error}</p>
        ) : null}
      </div>
    </div>
  );
}
