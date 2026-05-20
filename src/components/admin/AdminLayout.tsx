'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAuth } from '@/contexts/AuthContext';

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (loading) return;
    if (!configured) return;
    if (!user && !isLoginPage) {
      router.replace('/admin/login');
    } else if (user && isLoginPage) {
      router.replace('/admin');
    }
  }, [user, loading, configured, isLoginPage, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <span className="font-mono text-sm text-tertiary">Loading…</span>
      </div>
    );
  }

  if (!configured && !isLoginPage) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="serif-display text-3xl text-primary">
            Firebase not configured
          </h1>
          <p className="text-secondary text-sm leading-relaxed">
            Add your Firebase keys to <code className="text-gold font-mono">.env.local</code>{' '}
            (see <code className="text-gold font-mono">.env.local.example</code>),
            then restart the dev server.
          </p>
          <p className="text-tertiary text-xs font-mono">
            The public site keeps working while the admin is offline.
          </p>
          <Link
            href="/en/"
            className="inline-block mt-4 text-gold hover:text-gold-warm transition-colors text-sm"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <span className="font-mono text-sm text-tertiary">Redirecting…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-primary flex">
      <AdminSidebar />

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 start-0 w-64 bg-bg-elevated border-r border-border-subtle">
            <div className="flex items-center justify-between p-4 border-b border-border-subtle">
              <span className="font-mono text-xs uppercase tracking-widest text-tertiary">
                Admin
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 -m-2 text-secondary hover:text-primary"
                aria-label="Close menu"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="-mt-1">
              <AdminSidebar />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
