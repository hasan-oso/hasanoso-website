import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ExternalLink, Lock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  fetchAdjacentProjects,
  fetchAllProjectSlugs,
  fetchProjectBySlug,
} from '@/lib/projects-source';
import { locales, type Locale } from '@/i18n/settings';

export async function generateStaticParams() {
  const slugs = await fetchAllProjectSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const project = await fetchProjectBySlug(slug);
  const tMeta = await getTranslations({ locale, namespace: 'meta' });
  if (!project) {
    return { title: tMeta('title') };
  }
  const content = project.translations[locale as Locale];
  return {
    title: `${content.name} — ${tMeta('name')}`,
    description: content.tagline,
  };
}

export default async function ProjectDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(locale);

  const project = await fetchProjectBySlug(slug);
  if (!project) notFound();

  const loc = locale as Locale;
  const content = project.translations[loc];
  const t = await getTranslations({ locale, namespace: 'projectDetail' });
  const isArabic = loc === 'ar';

  const { prev, next } = await fetchAdjacentProjects(slug);

  const proseClass = isArabic
    ? 'font-arabic text-[17.5px] leading-[1.85] text-pretty'
    : 'font-sans text-[17.5px] leading-[1.7] text-pretty';

  const headingClass = isArabic
    ? 'font-arabic text-4xl sm:text-5xl text-primary text-balance leading-tight'
    : 'serif-display text-4xl sm:text-5xl text-primary text-balance leading-tight';

  return (
    <div className="container-essay pt-10 sm:pt-14 pb-20 sm:pb-28">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-tertiary hover:text-gold transition-colors duration-200 mb-12 font-mono text-[12px] uppercase tracking-widest keep-latin"
      >
        <ArrowLeft size={14} aria-hidden="true" className="rtl:rotate-180" />
        <span>{t('backToProjects')}</span>
      </Link>

      <header className="mb-12 sm:mb-14">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <StatusBadge status={project.status} />
          <span className="text-muted" aria-hidden="true">·</span>
          <span className="font-mono text-[11px] tracking-widest text-tertiary keep-latin">
            {project.year}
          </span>
        </div>

        <h1 className={headingClass}>{content.name}</h1>
        <div className="h-px w-12 bg-gold mt-6 mb-6" aria-hidden="true" />
        <p
          className={
            isArabic
              ? 'font-arabic text-secondary text-xl leading-relaxed text-pretty'
              : 'font-sans text-secondary text-xl leading-relaxed text-pretty'
          }
        >
          {content.tagline}
        </p>
      </header>

      <section className="mb-14 sm:mb-16">
        <p className={`${proseClass} text-primary/95`}>{content.overview}</p>
      </section>

      <CaseSection
        label={t('problem')}
        body={content.problem}
        proseClass={proseClass}
      />
      <CaseSection
        label={t('approach')}
        body={content.approach}
        proseClass={proseClass}
      />
      <CaseSection
        label={t('outcome')}
        body={content.outcome}
        proseClass={proseClass}
      />

      {content.lessons ? (
        <section className="mb-14 sm:mb-16 border-s-2 border-gold ps-6 sm:ps-8 py-1">
          <p className="font-mono text-[11px] uppercase tracking-ultrawide text-gold mb-5 keep-latin">
            {t('lessons')}
          </p>
          <p
            className={
              isArabic
                ? 'font-arabic text-[17.5px] leading-[1.85] text-primary/90 italic text-pretty'
                : 'font-sans text-[17.5px] leading-[1.7] text-primary/90 italic text-pretty'
            }
          >
            {content.lessons}
          </p>
        </section>
      ) : null}

      <section className="mb-14 sm:mb-16">
        <p className="font-mono text-[11px] uppercase tracking-ultrawide text-tertiary mb-5 keep-latin">
          {t('builtWith')}
        </p>
        <ul className="flex flex-wrap gap-2 keep-latin">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="font-mono text-[12px] text-secondary border border-border-subtle px-3 py-1 rounded-sm"
            >
              {tech.toLowerCase()}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16 sm:mb-20 surface-elevated rounded-sm p-7 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-ultrawide text-tertiary mb-5 keep-latin">
          {t('repository')}
        </p>

        {project.repoStatus === 'public' && project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-primary hover:text-gold transition-colors duration-200 font-mono text-[14px] keep-latin"
          >
            <ExternalLink size={18} aria-hidden="true" />
            <span className="link-underline">{project.repoUrl}</span>
          </a>
        ) : (
          <div className="flex items-start gap-4">
            <Lock
              size={18}
              className="text-tertiary mt-1 shrink-0"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <p className="text-primary font-mono text-[13px]">
                {t('privateRepo')}
              </p>
              <p
                className={
                  isArabic
                    ? 'font-arabic text-tertiary text-[15px] leading-relaxed text-pretty'
                    : 'font-sans text-tertiary text-[15px] leading-relaxed text-pretty'
                }
              >
                {project.privacyReason?.[loc]}
              </p>
            </div>
          </div>
        )}
      </section>

      <nav
        aria-label="Project navigation"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-12 border-t border-border-subtle"
      >
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex flex-col gap-1.5 text-start"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-tertiary group-hover:text-gold transition-colors duration-200 keep-latin">
              <ArrowLeft
                size={12}
                aria-hidden="true"
                className="rtl:rotate-180"
              />
              <span>{t('prev')}</span>
            </span>
            <span
              className={
                isArabic
                  ? 'font-arabic text-lg text-primary group-hover:text-gold transition-colors duration-200'
                  : 'serif-display text-lg text-primary group-hover:text-gold transition-colors duration-200'
              }
            >
              {prev.translations[loc].name}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex flex-col gap-1.5 sm:text-end text-start"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-tertiary group-hover:text-gold transition-colors duration-200 sm:justify-end keep-latin">
              <span>{t('next')}</span>
              <ArrowRight
                size={12}
                aria-hidden="true"
                className="rtl:rotate-180"
              />
            </span>
            <span
              className={
                isArabic
                  ? 'font-arabic text-lg text-primary group-hover:text-gold transition-colors duration-200'
                  : 'serif-display text-lg text-primary group-hover:text-gold transition-colors duration-200'
              }
            >
              {next.translations[loc].name}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

function CaseSection({
  label,
  body,
  proseClass,
}: {
  label: string;
  body: string;
  proseClass: string;
}) {
  return (
    <section className="mb-14 sm:mb-16">
      <p className="font-mono text-[11px] uppercase tracking-ultrawide text-gold mb-5 keep-latin">
        {label}
      </p>
      <p className={`${proseClass} text-secondary`}>{body}</p>
    </section>
  );
}
