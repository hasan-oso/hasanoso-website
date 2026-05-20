'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { ChipIllustration } from '@/components/ui/ChipIllustration';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

export function Hero() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const reduced = useReducedMotion();
  const isArabic = locale === 'ar';

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0.2 : 0.6,
      delay: reduced ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <section className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] glow-gold-soft"
        aria-hidden="true"
      />

      <div className="container-prose pt-12 sm:pt-20 pb-16 sm:pb-24 relative">
        <div className="flex flex-col items-center text-center gap-6 sm:gap-8 max-w-2xl mx-auto">
          <motion.div {...fade(0)} className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.10] sm:opacity-[0.13]"
            >
              <ChipIllustration size={380} />
            </div>
            <Avatar
              size={96}
              className="relative sm:w-[112px] sm:h-[112px]"
            />
          </motion.div>

          <motion.div {...fade(0.06)} className="space-y-3">
            <h1
              className={cn(
                'text-balance leading-[1.05]',
                isArabic
                  ? 'font-arabic text-5xl sm:text-6xl text-primary'
                  : 'serif-display text-5xl sm:text-6xl text-primary',
              )}
            >
              {isArabic ? (
                t('name')
              ) : (
                <>
                  <span>{t('name')}</span>
                  <span className="text-tertiary mx-3" aria-hidden="true">
                    ·
                  </span>
                  <span
                    className="font-arabic text-primary/85"
                    dir="rtl"
                    style={{ unicodeBidi: 'isolate' }}
                  >
                    حسن أوسو
                  </span>
                </>
              )}
            </h1>
            <div
              className="h-px w-[60px] bg-gold mx-auto"
              aria-hidden="true"
            />
          </motion.div>

          <motion.p
            {...fade(0.12)}
            className={cn(
              'text-secondary text-lg sm:text-xl leading-relaxed text-pretty max-w-md',
              isArabic ? 'font-arabic' : 'font-sans',
            )}
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            {...fade(0.18)}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 bg-gold text-bg-base px-6 py-3 text-sm font-medium hover:bg-gold-warm transition-colors duration-200 rounded-sm"
            >
              <span>{tCommon('viewWork')}</span>
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0"
              />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-200 px-3 py-3 text-sm font-medium link-underline"
            >
              <span>{tCommon('getInTouch')}</span>
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
