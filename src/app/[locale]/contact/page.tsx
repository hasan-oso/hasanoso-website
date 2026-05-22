import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/sections/SectionLabel';
import { ContactForm } from '@/components/contact/ContactForm';
import { locales, type Locale } from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const isArabic = locale === 'ar';

  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <section className="pt-32 pb-24 sm:pt-40">
      <Container variant="essay">
        <Reveal>
          <SectionLabel>{t('label')}</SectionLabel>
        </Reveal>

        <Reveal delay={120}>
          <h1
            className={[
              'mt-8 text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-text-bright',
              isArabic
                ? 'font-arabic-display font-bold'
                : 'font-display font-light',
            ].join(' ')}
          >
            {t('title')}
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-8 text-lg leading-relaxed text-text-muted text-pretty">
            {t('lede')}
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-16">
            <ContactForm locale={locale} />
          </div>
        </Reveal>

        <Reveal delay={420}>
          <div className="mt-16 border-t border-void-3/60 pt-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
              {t('direct.label')}
            </p>
            <a
              href={`mailto:${t('direct.email')}`}
              className="mt-3 inline-block text-lg text-neon-core hover:text-neon-soft transition-colors keep-latin"
            >
              {t('direct.email')} ↗
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
