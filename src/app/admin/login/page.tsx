'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/admin/AuthContext';

export default function AdminLoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated (admin), bounce to dashboard
  useEffect(() => {
    if (auth.ready && auth.user && auth.isAdmin) {
      router.replace('/admin');
    }
  }, [auth.ready, auth.user, auth.isAdmin, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    await auth.signIn(email, password);
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void-0 px-6">
      <div className="w-full max-w-md rounded-md border border-void-3 bg-void-1/60 p-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-gold-core/80">
          Admin
        </p>
        <h1 className="mt-4 text-2xl font-display text-text-bright">
          Sign in to continue
        </h1>

        {!auth.configured ? (
          <div className="mt-6 rounded-sm border border-red-500/40 bg-red-500/5 p-3 text-xs text-red-300">
            Firebase isn&apos;t configured in this environment. Set
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
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-void-3 bg-void-0 px-4 py-3 text-sm text-text-bright placeholder:text-text-ghost focus:border-gold-core focus:outline-none transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-void-3 bg-void-0 px-4 py-3 text-sm text-text-bright placeholder:text-text-ghost focus:border-gold-core focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={!auth.configured || submitting}
              className="w-full rounded-sm border border-gold-core bg-gold-core text-void-0 py-3 text-sm font-medium tracking-wide hover:bg-gold-warm hover:border-gold-warm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        {auth.error ? (
          <p className="mt-4 text-xs text-red-400">{auth.error}</p>
        ) : null}
      </div>
    </div>
  );
}
