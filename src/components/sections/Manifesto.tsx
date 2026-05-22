import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { LiveText } from '@/components/live/LiveText';
import { SectionLabel } from './SectionLabel';
import type { Locale } from '@/i18n/settings';

export async function Manifesto({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'manifesto' });
  const isArabic = locale === 'ar';

  return (
    <section className="relative py-32 sm:py-40">
      <Container variant="essay">
        <Reveal>
          <SectionLabel>{t('label')}</SectionLabel>
        </Reveal>

        <Reveal delay={120}>
          <LiveText
            as="h2"
            locale={locale}
            path="manifesto.title"
            fallback={t('title')}
            className={[
              'mt-6 text-balance text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-text-bright',
              isArabic
                ? 'font-arabic-display font-bold'
                : 'font-display font-light',
            ].join(' ')}
          />
        </Reveal>

        <Reveal delay={240}>
          <LiveText
            as="p"
            locale={locale}
            path="manifesto.body"
            fallback={t('body')}
            className="mt-8 text-pretty text-lg leading-relaxed text-text-muted"
          />
        </Reveal>

        <Reveal delay={360}>
          <LiveText
            as="p"
            locale={locale}
            path="manifesto.signature"
            fallback={t('signature')}
            className="mt-8 text-sm font-mono text-gold-core/80 tracking-[0.2em] uppercase"
          />
        </Reveal>
      </Container>
    </section>
  );
}
