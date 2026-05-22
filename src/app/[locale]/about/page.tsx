import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/sections/SectionLabel';
import { LiveText } from '@/components/live/LiveText';
import { locales, type Locale } from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const sectionKeys = ['background', 'now', 'approach'] as const;
const timelineKeys = ['one', 'two', 'three', 'four'] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const isArabic = locale === 'ar';

  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <article className="pt-32 pb-24 sm:pt-40">
      <Container variant="essay">
        <Reveal>
          <SectionLabel>{t('label')}</SectionLabel>
        </Reveal>

        <Reveal delay={100}>
          <LiveText
            as="h1"
            locale={locale}
            path="about.title"
            fallback={t('title')}
            className={[
              'mt-8 text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-text-bright',
              isArabic
                ? 'font-arabic-display font-bold'
                : 'font-display font-light',
            ].join(' ')}
          />
        </Reveal>

        <Reveal delay={200}>
          <LiveText
            as="p"
            locale={locale}
            path="about.lede"
            fallback={t('lede')}
            className="mt-8 text-xl leading-relaxed text-text-muted text-pretty"
          />
        </Reveal>

        <div className="mt-20 space-y-16">
          {sectionKeys.map((key, idx) => (
            <Reveal key={key} delay={120 + idx * 120}>
              <section>
                <h2
                  className={[
                    'text-2xl text-text-bright',
                    isArabic
                      ? 'font-arabic-display font-bold'
                      : 'font-display font-light',
                  ].join(' ')}
                >
                  {t(`sections.${key}.heading`)}
                </h2>
                <div
                  className="mt-3 h-px w-8 bg-gold-core/60"
                  aria-hidden="true"
                />
                <p className="mt-6 text-base leading-relaxed text-text-muted text-pretty">
                  {t(`sections.${key}.body`)}
                </p>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <section className="mt-24 border-t border-void-3/60 pt-12">
            <h2
              className={[
                'text-xl text-text-bright',
                isArabic
                  ? 'font-arabic-display font-bold'
                  : 'font-display font-light',
              ].join(' ')}
            >
              {t('timeline.heading')}
            </h2>
            <ol className="mt-8 space-y-4">
              {timelineKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-baseline gap-6 border-b border-void-3/40 pb-4"
                >
                  <span className="text-gold-core font-mono text-sm tracking-[0.2em] w-16 shrink-0 keep-latin">
                    {t(`timeline.items.${key}.year`)}
                  </span>
                  <span className="text-text-muted text-pretty">
                    {t(`timeline.items.${key}.text`)}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>
      </Container>
    </article>
  );
}
