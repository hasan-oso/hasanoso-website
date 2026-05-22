import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from './SectionLabel';
import { featuredProjects } from '@/data/projects';
import type { Locale } from '@/i18n/settings';

const accentClasses: Record<
  'gold' | 'neon' | 'violet',
  { ring: string; label: string }
> = {
  gold: { ring: 'border-gold-core/40 hover:border-gold-core', label: 'text-gold-core' },
  neon: { ring: 'border-neon-core/30 hover:border-neon-core/80', label: 'text-neon-core' },
  violet: { ring: 'border-violet-core/40 hover:border-violet-core', label: 'text-violet-core' },
};

export async function SelectedWork({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'selected' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const isArabic = locale === 'ar';
  const items = featuredProjects();

  return (
    <section className="relative py-32 sm:py-40 border-t border-void-3/40">
      <Container variant="app">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{t('label')}</SectionLabel>
            </Reveal>
            <Reveal delay={120}>
              <h2
                className={[
                  'mt-6 text-balance text-3xl sm:text-4xl lg:text-5xl leading-[1.15] text-text-bright',
                  isArabic
                    ? 'font-arabic-display font-bold'
                    : 'font-display font-light',
                ].join(' ')}
              >
                {t('title')}
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-4 max-w-xl text-text-muted text-pretty">
                {t('subtitle')}
              </p>
            </Reveal>
          </div>

          <Reveal delay={300}>
            <Button href={`/${locale}/work`} variant="ghost">
              {t('viewAll')} →
            </Button>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((project, idx) => {
            const a = accentClasses[project.accent];
            return (
              <Reveal key={project.slug} delay={200 + idx * 120} as="li">
                <Link
                  href={`/${locale}/work/${project.slug}`}
                  className={`group relative block h-full rounded-lg border bg-void-1/60 p-8 transition-all hover:bg-void-1 ${a.ring}`}
                >
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-[0.3em] ${a.label}`}
                    >
                      {project.year}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-ghost keep-latin">
                      {project.stack.slice(0, 2).join(' · ')}
                    </span>
                  </div>
                  <h3
                    className={[
                      'mt-8 text-2xl text-text-bright text-balance',
                      isArabic
                        ? 'font-arabic-display font-bold'
                        : 'font-display font-light',
                    ].join(' ')}
                  >
                    {project.title[locale]}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-text-muted text-pretty">
                    {project.summary[locale]}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-text-faint group-hover:text-gold-core transition-colors">
                    {tCommon('viewProject')}
                    <span className="rtl:rotate-180">→</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
