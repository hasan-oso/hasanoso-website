'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  FileText,
  MessageSquare,
  Settings,
  Globe,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/content', label: 'Page Content', icon: FileText },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <aside className="hidden md:flex w-64 bg-bg-elevated border-r border-border-subtle min-h-screen flex-col">
      <div className="p-6 border-b border-border-subtle">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-bg-base">
            <span className="serif-display text-sm text-gold">HO</span>
          </div>
          <div>
            <div className="serif-display text-primary leading-tight">
              Hasan Oso
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-tertiary">
              Admin
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3" aria-label="Admin navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors duration-150',
                    active
                      ? 'bg-gold/10 text-gold'
                      : 'text-secondary hover:bg-bg-subtle hover:text-primary',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-border-subtle space-y-1">
        {user?.email ? (
          <p className="px-4 pb-2 text-[11px] font-mono text-tertiary truncate keep-latin">
            {user.email}
          </p>
        ) : null}
        <Link
          href="/en/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:text-primary transition-colors duration-150"
        >
          <Globe size={15} aria-hidden="true" />
          <span>View site</span>
        </Link>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:text-semantic-error transition-colors duration-150 w-full text-start"
        >
          <LogOut size={15} aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
