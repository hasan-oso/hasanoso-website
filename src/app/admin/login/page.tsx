'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

type FirebaseAuthError = { code?: string; message?: string };

export default function LoginPage() {
  const { signIn, configured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      toast.error('Firebase is not configured.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back, Hasan.');
      router.replace('/admin');
    } catch (err) {
      const e = err as FirebaseAuthError;
      const msg =
        e.code === 'auth/invalid-credential' ||
        e.code === 'auth/wrong-password' ||
        e.code === 'auth/user-not-found'
          ? 'Invalid email or password.'
          : e.code === 'auth/too-many-requests'
            ? 'Too many attempts. Try again in a few minutes.'
            : 'Sign in failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold mb-6 bg-bg-elevated">
            <span className="serif-display text-xl text-gold">HO</span>
          </div>
          <h1 className="serif-display text-3xl text-primary mb-2">
            Admin access
          </h1>
          <p className="text-secondary text-sm">
            Sign in to manage your site.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-[11px] uppercase tracking-widest text-tertiary mb-2 keep-latin"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute start-3.5 top-1/2 -translate-y-1/2 text-tertiary"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="osohasan.ai@gmail.com"
                className="w-full bg-bg-elevated border border-border-subtle rounded-md ps-10 pe-4 py-2.5 text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors text-sm keep-latin"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-[11px] uppercase tracking-widest text-tertiary mb-2 keep-latin"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute start-3.5 top-1/2 -translate-y-1/2 text-tertiary"
                aria-hidden="true"
              />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg-elevated border border-border-subtle rounded-md ps-10 pe-4 py-2.5 text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors text-sm keep-latin"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !configured}
            className="group w-full inline-flex items-center justify-center gap-2 bg-gold text-bg-base font-medium py-2.5 rounded-md hover:bg-gold-warm transition-colors disabled:opacity-50 text-sm"
          >
            {submitting ? (
              <span>Signing in…</span>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </form>

        {!configured ? (
          <p className="text-center text-[11px] text-rose-400/80 mt-6 font-mono">
            Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars.
          </p>
        ) : null}

        <p className="text-center text-[11px] text-tertiary mt-8 font-mono">
          Restricted to the site owner.
        </p>

        <div className="text-center mt-2">
          <Link
            href="/en/"
            className="text-[11px] text-tertiary hover:text-secondary font-mono"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
