'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function titleFor(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  const seg = pathname.split('/').filter(Boolean)[1];
  if (!seg) return 'Dashboard';
  const map: Record<string, string> = {
    projects: 'Projects',
    skills: 'Skills',
    content: 'Page Content',
    messages: 'Messages',
    settings: 'Settings',
    login: 'Sign in',
  };
  return map[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
}

export function AdminHeader({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = titleFor(pathname);

  return (
    <header className="h-14 border-b border-border-subtle bg-bg-base/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-30">
      <button
        type="button"
        onClick={onMenuOpen}
        className="md:hidden me-3 p-2 -m-2 text-secondary hover:text-primary transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} aria-hidden="true" />
      </button>
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="font-mono text-[11px] uppercase tracking-widest text-tertiary hover:text-primary transition-colors"
        >
          Admin
        </Link>
        <span className="text-muted" aria-hidden="true">
          /
        </span>
        <h1 className="text-sm text-primary">{title}</h1>
      </div>
      <div className="ms-auto flex items-center gap-3">
        {user?.email ? (
          <span className="hidden sm:inline font-mono text-[11px] text-tertiary keep-latin">
            {user.email}
          </span>
        ) : null}
      </div>
    </header>
  );
}
