import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from './SectionLabel';
import type { Locale } from '@/i18n/settings';

const groups = {
  lang: ['Python', 'TypeScript', 'Rust', 'Go'],
  ml: ['PyTorch', 'Transformers', 'GGML', 'LangChain'],
  infra: ['Postgres', 'FAISS', 'Cloudflare', 'Docker'],
  ui: ['React 19', 'Next.js 15', 'Three.js', 'Tailwind'],
} as const;

const groupKeys = ['lang', 'ml', 'infra', 'ui'] as const;

export async function Stack({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'stack' });
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

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {groupKeys.map((key, idx) => (
            <Reveal key={key} delay={200 + idx * 100}>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
                  {t(`groups.${key}`)}
                </p>
                <ul className="mt-4 space-y-2">
                  {groups[key].map((item) => (
                    <li
                      key={item}
                      className="text-text-muted font-mono text-sm keep-latin"
                    >
                      <span className="text-gold-core/40 mr-2 rtl:mr-0 rtl:ml-2">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
