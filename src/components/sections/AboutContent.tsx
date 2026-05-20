'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

const languageKeys = ['arabic', 'turkish', 'english'] as const;

export function AboutContent() {
  const t = useTranslations('about');
  const locale = useLocale();
  const reduced = useReducedMotion();
  const isArabic = locale === 'ar';

  const paragraphs = t('narrative')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: {
      duration: reduced ? 0.2 : 0.7,
      delay: reduced ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  const proseFont = isArabic
    ? 'font-arabic text-[19px] leading-[1.85]'
    : 'font-sans text-[18px] leading-[1.7]';

  return (
    <>
      <section className="container-essay pt-10 sm:pt-16 pb-12 sm:pb-16">
        <motion.header
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-12"
        >
          <h1
            className={cn(
              'text-balance text-primary mb-4',
              isArabic
                ? 'font-arabic text-4xl sm:text-5xl'
                : 'serif-display text-4xl sm:text-5xl',
            )}
          >
            {t('title')}
          </h1>
          <p
            className={cn(
              'text-secondary text-pretty',
              isArabic ? 'font-arabic text-lg' : 'font-sans text-lg',
            )}
          >
            {t('subtitle')}
          </p>
          <div className="h-px w-12 bg-gold mt-8" aria-hidden="true" />
        </motion.header>

        <motion.div {...fade(0.05)} className="space-y-8">
          {paragraphs.map((para, idx) => (
            <p key={idx} className={cn('text-primary/95 text-pretty', proseFont)}>
              {para}
            </p>
          ))}
        </motion.div>

        <motion.div
          {...fade(0.1)}
          className="mt-12 pt-8 border-t border-border-subtle"
        >
          <p
            className={cn(
              'text-pretty leading-relaxed',
              isArabic ? 'font-arabic text-base' : 'font-sans text-[15px]',
            )}
          >
            <span className="text-tertiary me-2">{t('toolsLabel')}:</span>
            <span className="text-primary keep-latin">{t('toolsLine')}</span>
          </p>
        </motion.div>
      </section>

      <section className="container-prose pb-12 sm:pb-16">
        <motion.ul
          {...fade(0.1)}
          className="grid gap-4 sm:grid-cols-3"
        >
          <InfoCard
            label={t('educationLabel')}
            title={t('educationSchool')}
            body={t('educationProgram')}
            tail={t('educationCity')}
            isArabic={isArabic}
          />
          <InfoCard
            label={t('languagesLabel')}
            title=""
            body={
              <ul className="space-y-1.5 text-[14.5px]">
                {languageKeys.map((key) => (
                  <li key={key} className="text-primary/95">
                    {t(`languages.${key}`)}
                  </li>
                ))}
              </ul>
            }
            isArabic={isArabic}
          />
          <InfoCard
            label={t('nowLabel')}
            title=""
            body={t('nowText')}
            isArabic={isArabic}
          />
        </motion.ul>
      </section>

      <section className="container-essay pb-20 sm:pb-28">
        <motion.div {...fade(0.05)} className="pt-12 border-t border-border-subtle">
          <p className="font-mono text-[11px] uppercase tracking-ultrawide text-tertiary mb-4 keep-latin">
            {t('philosophyLabel')}
          </p>
          <blockquote
            className={cn(
              'border-s-2 border-gold ps-5 mb-6',
              isArabic ? 'font-arabic text-xl' : 'serif-display text-2xl',
            )}
          >
            <p className="text-primary text-pretty leading-snug">
              {t('philosophyQuote')}
            </p>
          </blockquote>
          <p
            className={cn(
              'text-secondary text-pretty leading-relaxed',
              isArabic ? 'font-arabic text-base' : 'font-sans text-[16px]',
            )}
          >
            {t('philosophyBody')}
          </p>
        </motion.div>
      </section>
    </>
  );
}

function InfoCard({
  label,
  title,
  body,
  tail,
  isArabic,
}: {
  label: string;
  title?: string;
  body: React.ReactNode;
  tail?: string;
  isArabic: boolean;
}) {
  void isArabic;
  return (
    <li className="surface-elevated rounded-sm p-6 transition-colors duration-300 hover:border-gold/40">
      <p className="font-mono text-[11px] uppercase tracking-ultrawide text-gold mb-3 keep-latin">
        {label}
      </p>
      {title ? (
        <p className="serif-display text-lg text-primary mb-1.5">{title}</p>
      ) : null}
      {typeof body === 'string' ? (
        <p className="text-primary/95 text-[14.5px] leading-relaxed text-pretty">
          {body}
        </p>
      ) : (
        body
      )}
      {tail ? (
        <p className="text-tertiary text-[13px] mt-2 keep-latin">{tail}</p>
      ) : null}
    </li>
  );
}
