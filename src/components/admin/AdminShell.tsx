'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { useAuth } from './AuthContext';

const items = [
  { href: '/admin', label: 'لوحة التحكم' },
  { href: '/admin/messages', label: 'الرسائل' },
  { href: '/admin/content', label: 'المحتوى' },
  { href: '/admin/settings', label: 'الإعدادات' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';
  const auth = useAuth();

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-void-0 text-text-primary">
      <aside className="border-b md:border-b-0 md:border-l border-void-3 bg-void-1/40 p-6 md:sticky md:top-0 md:h-screen flex md:flex-col gap-6 md:gap-10 items-center md:items-stretch justify-between md:justify-start">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-gold-core/80">
            لوحة التحكم
          </p>
          <p className="mt-1 text-text-bright font-display tracking-wide keep-latin">
            Hasan Oso
          </p>
        </div>

        <nav className="hidden md:flex md:flex-col gap-1 mt-2">
          {items.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin' || pathname === '/admin/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'px-3 py-2 rounded-sm text-sm transition-colors',
                  active
                    ? 'bg-void-3/60 text-text-bright border-r-2 border-gold-core'
                    : 'text-text-muted hover:text-text-bright hover:bg-void-3/30',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block mt-auto">
          <div className="border-t border-void-3 pt-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-ghost">
              مسجّل الدخول
            </p>
            <p className="mt-1 text-xs text-text-muted truncate keep-latin">
              {auth.user?.email ?? '—'}
            </p>
            <button
              type="button"
              onClick={() => auth.signOut()}
              className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-text-faint hover:text-gold-core transition-colors cursor-pointer"
            >
              ← تسجيل خروج
            </button>
          </div>
        </div>

        {/* Mobile: compact nav */}
        <nav className="flex md:hidden gap-2 overflow-x-auto">
          {items.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin' || pathname === '/admin/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'px-3 py-1.5 rounded-sm text-xs whitespace-nowrap transition-colors',
                  active
                    ? 'bg-void-3/60 text-text-bright'
                    : 'text-text-muted hover:text-text-bright',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="p-6 md:p-12 max-w-5xl">{children}</main>
    </div>
  );
}
