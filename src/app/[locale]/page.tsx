import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';
import { HeroSceneClient } from '@/components/three/HeroSceneClient';
import { Manifesto } from '@/components/sections/Manifesto';
import { Currently } from '@/components/sections/Currently';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Stack } from '@/components/sections/Stack';
import { LiveText } from '@/components/live/LiveText';
import { locales, type Locale } from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;

  const t = await getTranslations({ locale, namespace: 'hero' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const isArabic = locale === 'ar';

  return (
    <>
      {/* HERO */}
      <section className="relative isolate min-h-screen overflow-hidden bg-void-0">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <HeroSceneClient />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-32 text-center">
          <LiveText
            as="p"
            locale={locale}
            path="hero.topbar"
            fallback={t('topbar')}
            className="text-gold-core italic font-display text-sm tracking-[0.4em] uppercase keep-latin"
          />

          <div className="mt-6">
            <Heading level={1} tone="bright" display={!isArabic}>
              <LiveText
                locale={locale}
                path="hero.name"
                fallback={t('name')}
              />
            </Heading>
          </div>

          <div className="mt-6 h-px w-12 bg-gold-core" aria-hidden="true" />

          <LiveText
            as="p"
            locale={locale}
            path="hero.subtitle"
            fallback={t('subtitle')}
            className="mt-8 max-w-2xl text-pretty text-lg sm:text-xl leading-relaxed text-text-muted"
          />

          <LiveText
            as="p"
            locale={locale}
            path="hero.intro"
            fallback={t('intro')}
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-text-faint"
          />

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button href={`/${locale}/work`} variant="primary">
              {tCommon('viewWork')}
            </Button>
            <Button href={`/${locale}/contact`} variant="neon">
              {tCommon('getInTouch')}
            </Button>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <span
              className="text-text-ghost text-[10px] font-mono uppercase tracking-[0.4em] keep-latin"
              aria-hidden="true"
            >
              {tCommon('scroll')} ↓
            </span>
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <Manifesto locale={locale} />
      <Currently locale={locale} />
      <SelectedWork locale={locale} />
      <Stack locale={locale} />
    </>
  );
}
