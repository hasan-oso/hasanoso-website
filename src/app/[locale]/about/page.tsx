import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { AboutContent } from '@/components/sections/AboutContent';
import { locales } from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: `${t('title')} — ${tMeta('name')}`,
    description: t('subtitle'),
  };
}

export default function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <AboutContent />;
}
