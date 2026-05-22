import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Amiri,
} from 'next/font/google';

import '../globals.css';
import { locales, localeDirection, type Locale } from '@/i18n/settings';
import { cn } from '@/lib/utils';
import { Header } from '@/components/chrome/Header';
import { Footer } from '@/components/chrome/Footer';
import { LiveContentProvider } from '@/components/live/LiveContentProvider';
import { CursorGlow } from '@/components/fx/CursorGlow';
import { SmoothScroll } from '@/components/fx/SmoothScroll';
import { PageFadeIn } from '@/components/fx/PageFadeIn';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
});

const geistSans = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-arabic',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};

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
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const dir = localeDirection[locale as Locale];
  const isArabic = locale === 'ar';

  const fontClasses = [
    cormorant.variable,
    geistSans.variable,
    geistMono.variable,
    ibmArabic.variable,
    amiri.variable,
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
          'min-h-screen bg-void-1 text-text-primary antialiased',
          isArabic && 'body-arabic',
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-gold-core focus:text-void-0 focus:px-4 focus:py-2 focus:rounded-sm focus:text-sm"
        >
          {tCommon('skipToContent')}
        </a>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LiveContentProvider>
            <PageFadeIn />
            <CursorGlow />
            <SmoothScroll />
            <Header locale={locale as Locale} />
            <main id="main" className="min-h-screen">
              {children}
            </main>
            <Footer locale={locale as Locale} />
          </LiveContentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
