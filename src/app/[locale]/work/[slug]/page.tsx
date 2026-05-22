import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/sections/SectionLabel';
import { getProject, projectSlugs } from '@/data/projects';
import { locales, type Locale } from '@/i18n/settings';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projectSlugs().map((slug) => ({ locale, slug })),
  );
}

const sectionKeys = ['summary', 'challenge', 'approach', 'outcome'] as const;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const isArabic = locale === 'ar';

  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: 'projectDetail' });

  const bodyFor: Record<(typeof sectionKeys)[number], string> = {
    summary: project.summary[locale],
    challenge: project.challenge[locale],
    approach: project.approach[locale],
    outcome: project.outcome[locale],
  };

  return (
    <article className="pt-32 pb-24 sm:pt-40">
      <Container variant="essay">
        <Reveal>
          <Link
            href={`/${locale}/work`}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-text-faint hover:text-gold-core transition-colors"
          >
            <span className="rtl:rotate-180">←</span>
            {t('backToWork')}
          </Link>
        </Reveal>

        <Reveal delay={100}>
          <SectionLabel className="mt-12">{String(project.year)}</SectionLabel>
        </Reveal>

        <Reveal delay={200}>
          <h1
            className={[
              'mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-text-bright',
              isArabic
                ? 'font-arabic-display font-bold'
                : 'font-display font-light',
            ].join(' ')}
          >
            {project.title[locale]}
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-void-3/60 py-8 text-sm md:grid-cols-3">
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
                {t('role')}
              </dt>
              <dd className="mt-2 text-text-muted text-pretty">
                {project.role[locale]}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
                {t('year')}
              </dt>
              <dd className="mt-2 text-text-muted keep-latin">{project.year}</dd>
            </div>
            <div className="col-span-2 md:col-span-1">
              <dt className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
                {t('stack')}
              </dt>
              <dd className="mt-2 text-text-muted font-mono text-xs keep-latin">
                {project.stack.join(' · ')}
              </dd>
            </div>
            {project.links ? (
              <div className="col-span-2 md:col-span-3">
                <dt className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
                  {t('links')}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-4 text-sm">
                  {project.links.live ? (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-core hover:text-neon-soft transition-colors keep-latin"
                    >
                      {t('live')} ↗
                    </a>
                  ) : null}
                  {project.links.repo ? (
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-core hover:text-neon-soft transition-colors keep-latin"
                    >
                      {t('repo')} ↗
                    </a>
                  ) : null}
                </dd>
              </div>
            ) : null}
          </dl>
        </Reveal>

        <div className="mt-16 space-y-14">
          {sectionKeys.map((key, idx) => (
            <Reveal key={key} delay={120 + idx * 100}>
              <section>
                <h2
                  className={[
                    'text-2xl text-text-bright',
                    isArabic
                      ? 'font-arabic-display font-bold'
                      : 'font-display font-light',
                  ].join(' ')}
                >
                  {t(key)}
                </h2>
                <div
                  className="mt-3 h-px w-8 bg-gold-core/60"
                  aria-hidden="true"
                />
                <p className="mt-6 text-base leading-relaxed text-text-muted text-pretty">
                  {bodyFor[key]}
                </p>
              </section>
            </Reveal>
          ))}
        </div>
      </Container>
    </article>
  );
}
