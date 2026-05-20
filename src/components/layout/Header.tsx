'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { Locale } from '@/i18n/settings';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', key: 'home', match: 'exact' as const },
  { href: '/about', key: 'about', match: 'startsWith' as const },
  { href: '/projects', key: 'projects', match: 'startsWith' as const },
  { href: '/contact', key: 'contact', match: 'startsWith' as const },
] as const;

export function Header({ locale }: { locale: Locale }) {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tHero = useTranslations('hero');
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const wordmark = locale === 'ar' ? tHero('name') : 'Hasan Oso';
  const wordmarkClass = locale === 'ar' ? 'font-arabic' : 'serif-display';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 h-[var(--header-h)] transition-colors duration-300',
          scrolled
            ? 'bg-bg-base/90 backdrop-blur-md border-b border-border-subtle'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="container-prose h-full flex items-center justify-between gap-6">
          <Link
            href="/"
            className="group inline-flex items-center"
            aria-label={wordmark}
          >
            <span
              className={cn(
                'text-lg sm:text-xl tracking-wide text-primary group-hover:text-gold transition-colors duration-200',
                wordmarkClass,
              )}
            >
              {wordmark}
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8"
          >
            <ul className="flex items-center gap-7">
              {navItems.map((item) => {
                const active =
                  item.match === 'exact'
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'link-underline text-sm tracking-wide transition-colors duration-200',
                        active ? 'text-primary' : 'text-secondary hover:text-primary',
                      )}
                    >
                      {tNav(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <span
              className="h-4 w-px bg-border-subtle"
              aria-hidden="true"
            />
            <LanguageSwitcher />
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 -m-2 text-primary hover:text-gold transition-colors"
            aria-label={tCommon('openMenu')}
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden bg-bg-base"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="h-[var(--header-h)] flex items-center justify-between container-prose">
              <span
                className={cn(
                  'text-lg tracking-wide text-primary',
                  wordmarkClass,
                )}
              >
                {wordmark}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 -m-2 text-primary"
                aria-label={tCommon('closeMenu')}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <nav className="container-prose pt-8" aria-label="Mobile">
              <ul className="space-y-2">
                {navItems.map((item, idx) => {
                  const active =
                    item.match === 'exact'
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.05 + idx * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          'block py-3 text-3xl tracking-tight border-b border-border-subtle transition-colors duration-200',
                          locale === 'ar' ? 'font-arabic' : 'serif-display',
                          active ? 'text-gold' : 'text-primary hover:text-gold',
                        )}
                      >
                        {tNav(item.key)}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-10">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
