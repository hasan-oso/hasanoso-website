import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from './SectionLabel';
import type { Locale } from '@/i18n/settings';

const keys = ['one', 'two', 'three'] as const;

export async function Currently({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'currently' });
  const isArabic = locale === 'ar';

  return (
    <section className="relative py-32 sm:py-40 border-t border-void-3/40 bg-void-1/40">
      <Container variant="app">
        <Reveal>
          <SectionLabel>{t('label')}</SectionLabel>
        </Reveal>

        <Reveal delay={120}>
          <h2
            className={[
              'mt-6 max-w-3xl text-balance text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-text-bright',
              isArabic
                ? 'font-arabic-display font-bold'
                : 'font-display font-light',
            ].join(' ')}
          >
            {t('title')}
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-8 md:grid-cols-3">
          {keys.map((key, idx) => (
            <Reveal key={key} delay={200 + idx * 120} as="li">
              <article className="group relative flex h-full flex-col rounded-lg border border-void-3/60 bg-void-0/60 p-6 transition-colors hover:border-gold-core/60">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
                  {t(`items.${key}.status`)}
                </span>
                <h3
                  className={[
                    'mt-4 text-xl text-text-bright text-balance',
                    isArabic
                      ? 'font-arabic-display font-bold'
                      : 'font-display font-light',
                  ].join(' ')}
                >
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted text-pretty">
                  {t(`items.${key}.summary`)}
                </p>
                <span className="mt-6 inline-block h-px w-8 bg-gold-core/40 transition-all group-hover:w-16 group-hover:bg-gold-core/80" />
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
