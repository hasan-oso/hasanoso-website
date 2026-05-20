import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { fetchProjects } from '@/lib/projects-source';
import { locales, type Locale } from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'projects' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: `${t('title')} — ${tMeta('name')}`,
    description: t('intro'),
  };
}

export default async function ProjectsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'projects' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const isArabic = loc === 'ar';

  const projects = await fetchProjects();

  return (
    <div className="container-narrow pt-10 sm:pt-16 pb-20 sm:pb-28">
      <header className="mb-14 sm:mb-16">
        <p className="font-mono text-[11px] uppercase tracking-ultrawide text-gold mb-4 keep-latin">
          {t('overline')}
        </p>
        <h1
          className={
            isArabic
              ? 'font-arabic text-4xl sm:text-5xl text-primary text-balance mb-4'
              : 'serif-display text-4xl sm:text-5xl text-primary text-balance mb-4'
          }
        >
          {t('title')}
        </h1>
        <div className="h-px w-12 bg-gold mb-6" aria-hidden="true" />
        <p
          className={
            isArabic
              ? 'font-arabic text-secondary text-lg leading-relaxed text-pretty max-w-2xl'
              : 'font-sans text-secondary text-lg leading-relaxed text-pretty max-w-2xl'
          }
        >
          {t('intro')}
        </p>
      </header>

      <ul className="space-y-5 sm:space-y-6">
        {projects.map((project, index) => {
          const content = project.translations[loc];
          return (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group block surface-elevated rounded-sm p-7 sm:p-8 transition-all duration-300 hover:border-gold/50"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusBadge status={project.status} />
                    <span className="text-muted" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-mono text-[11px] tracking-widest text-tertiary keep-latin">
                      {project.year}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] tracking-widest text-muted keep-latin tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h2
                  className={
                    isArabic
                      ? 'font-arabic text-2xl sm:text-3xl text-primary group-hover:text-gold transition-colors duration-300 mb-3 text-balance'
                      : 'serif-display text-2xl sm:text-3xl text-primary group-hover:text-gold transition-colors duration-300 mb-3 text-balance'
                  }
                >
                  {content.name}
                </h2>

                <p
                  className={
                    isArabic
                      ? 'font-arabic text-secondary text-base leading-relaxed mb-2 text-pretty'
                      : 'font-sans text-secondary text-base leading-relaxed mb-2 text-pretty'
                  }
                >
                  {content.tagline}
                </p>

                <p
                  className={
                    isArabic
                      ? 'font-arabic text-tertiary text-[15px] leading-relaxed mb-6 text-pretty'
                      : 'font-sans text-tertiary text-[15px] leading-relaxed mb-6 text-pretty'
                  }
                >
                  {content.teaser}
                </p>

                <span className="inline-flex items-center gap-2 text-gold group-hover:gap-3 transition-all duration-300 font-mono text-[12px] uppercase tracking-widest">
                  <span>{t('readMore')}</span>
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="rtl:rotate-180"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-14 text-tertiary text-sm text-center">
        {tCommon('availableUponRequest')}
      </p>
    </div>
  );
}
