import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Container } from '@/components/ui/Container';
import type { Locale } from '@/i18n/settings';

/**
 * Top-fixed minimal header. Server component — reads translations on
 * the server, renders a static element. The LanguageSwitcher is a
 * client island.
 */
export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });

  const items = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/work`, label: t('work') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-void-0/60 border-b border-void-3/50">
      <Container variant="app" as="div">
        <div className="flex h-14 items-center justify-between gap-6">
          <Link
            href={`/${locale}`}
            className="text-sm font-display tracking-[0.18em] uppercase text-text-bright hover:text-gold-core transition-colors keep-latin"
          >
            {tMeta('name')}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted hover:text-gold-core transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher currentLocale={locale} />
        </div>
      </Container>
    </header>
  );
}
