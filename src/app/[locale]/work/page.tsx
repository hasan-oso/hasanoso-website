import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/sections/SectionLabel';
import { projects } from '@/data/projects';
import { locales, type Locale } from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const isArabic = locale === 'ar';

  const t = await getTranslations({ locale, namespace: 'work' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Newest first
  const sorted = [...projects].sort((a, b) => b.year - a.year);

  return (
    <section className="pt-32 pb-24 sm:pt-40">
      <Container variant="app">
        <Reveal>
          <SectionLabel>{t('label')}</SectionLabel>
        </Reveal>

        <Reveal delay={100}>
          <h1
            className={[
              'mt-8 max-w-3xl text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-text-bright',
              isArabic
                ? 'font-arabic-display font-bold'
                : 'font-display font-light',
            ].join(' ')}
          >
            {t('title')}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 max-w-2xl text-text-muted text-pretty leading-relaxed">
            {t('subtitle')}
          </p>
        </Reveal>

        <ul className="mt-20 divide-y divide-void-3/40 border-t border-void-3/40">
          {sorted.length === 0 ? (
            <li className="py-12 text-text-faint">{t('empty')}</li>
          ) : (
            sorted.map((p, idx) => (
              <Reveal key={p.slug} delay={120 + idx * 80} as="li">
                <Link
                  href={`/${locale}/work/${p.slug}`}
                  className="group block py-10 transition-colors hover:bg-void-1/40"
                >
                  <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6">
                    <span className="text-gold-core font-mono text-xs tracking-[0.2em] keep-latin">
                      {p.year}
                    </span>
                    <h2
                      className={[
                        'text-2xl sm:text-3xl text-text-bright group-hover:text-gold-core transition-colors text-pretty',
                        isArabic
                          ? 'font-arabic-display font-bold'
                          : 'font-display font-light',
                      ].join(' ')}
                    >
                      {p.title[locale]}
                    </h2>
                    <span className="hidden md:inline text-xs font-mono uppercase tracking-[0.2em] text-text-ghost group-hover:text-text-muted transition-colors keep-latin">
                      {p.stack.slice(0, 2).join(' · ')}
                    </span>
                  </div>
                  <p className="mt-3 ml-[3.5rem] rtl:ml-0 rtl:mr-[3.5rem] max-w-2xl text-sm leading-relaxed text-text-muted text-pretty">
                    {p.summary[locale]}
                  </p>
                  <span className="mt-4 ml-[3.5rem] rtl:ml-0 rtl:mr-[3.5rem] inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint group-hover:text-gold-core transition-colors">
                    {tCommon('viewProject')}
                    <span className="rtl:rotate-180">→</span>
                  </span>
                </Link>
              </Reveal>
            ))
          )}
        </ul>
      </Container>
    </section>
  );
}
