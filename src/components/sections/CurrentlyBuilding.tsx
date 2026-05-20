'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Locale } from '@/i18n/settings';
import type { Project } from '@/app/[locale]/projects/_data/projects';

export function CurrentlyBuilding({ project }: { project: Project | null }) {
  const tCommon = useTranslations('common');
  const tProjects = useTranslations('projects');
  const reduced = useReducedMotion();
  const locale = useLocale() as Locale;

  if (!project) return null;
  const content = project.translations[locale];
  const statusLabel = tProjects(`status.${project.status}`);

  return (
    <section className="container-prose pb-20 sm:pb-28">
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: reduced ? 0.2 : 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="flex flex-col items-center text-center"
      >
        <p className="font-mono text-[11px] uppercase tracking-ultrawide text-tertiary mb-6 keep-latin">
          {tCommon('currentlyBuilding')}
        </p>

        <Link
          href={`/projects/${project.slug}`}
          className="group block w-full max-w-md surface-elevated rounded-sm p-7 sm:p-8 text-start transition-colors duration-300 hover:border-gold"
        >
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-gold mb-4 keep-latin">
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse"
            />
            <span>{statusLabel}</span>
            <span className="text-tertiary" aria-hidden="true">
              ·
            </span>
            <span className="text-tertiary">{project.year}</span>
          </div>

          <h3 className="serif-display text-2xl sm:text-3xl text-primary mb-3">
            {content.name}
          </h3>

          <p className="text-secondary text-pretty leading-relaxed text-[15px] mb-5">
            {content.teaser}
          </p>

          <span className="inline-flex items-center gap-2 text-sm text-gold group-hover:text-gold-warm transition-colors duration-200">
            <span>{tProjects('readMore')}</span>
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 rtl:group-hover:translate-x-0"
            />
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
