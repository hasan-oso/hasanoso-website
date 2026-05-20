import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import {
  Playfair_Display,
  Inter,
  IBM_Plex_Sans_Arabic,
  JetBrains_Mono,
} from 'next/font/google';

import '../globals.css';
import { locales, localeDirection, type Locale } from '@/i18n/settings';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppShell } from '@/components/layout/AppShell';
import { PageTransition } from '@/components/layout/PageTransition';
import { BrandPattern } from '@/components/effects/BrandPattern';
import { cn } from '@/lib/utils';

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-serif',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-arabic',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://hasanoso.pages.dev'),
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        en: '/en/',
        ar: '/ar/',
        tr: '/tr/',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `/${locale}/`,
      siteName: t('name'),
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  const messages = await getMessages();
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const dir = localeDirection[locale as Locale];
  const isArabic = locale === 'ar';

  const fontClasses = [
    sans.variable,
    serif.variable,
    mono.variable,
    arabic.variable,
  ].join(' ');

  return (
    <html
      lang={locale}
      dir={dir}
      className={fontClasses}
      suppressHydrationWarning
    >
      <body
        className={cn(
          'min-h-screen bg-bg-base text-primary',
          isArabic && 'body-arabic',
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-gold focus:text-bg-base focus:px-4 focus:py-2 focus:rounded-sm focus:text-sm"
        >
          {tCommon('skipToContent')}
        </a>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppShell>
            <BrandPattern />
            <Header locale={locale as Locale} />
            <div className="relative z-10 flex min-h-screen flex-col pt-[var(--header-h)]">
              <main id="main" className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer locale={locale as Locale} />
            </div>
          </AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
