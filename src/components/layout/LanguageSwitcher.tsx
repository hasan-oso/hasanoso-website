'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeShortNames, type Locale } from '@/i18n/settings';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
    }
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[11px] tracking-widest',
        pending && 'opacity-60',
        className,
      )}
    >
      {locales.map((code, idx) => (
        <span key={code} className="inline-flex items-center gap-2 keep-latin">
          <button
            type="button"
            onClick={() => change(code)}
            aria-current={code === locale ? 'true' : undefined}
            className={cn(
              'transition-colors duration-200',
              code === locale
                ? 'text-primary'
                : 'text-tertiary hover:text-primary',
            )}
          >
            {localeShortNames[code]}
          </button>
          {idx < locales.length - 1 ? (
            <span className="text-muted" aria-hidden="true">
              /
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
