'use client';

import { useRouter, usePathname } from 'next/navigation';
import { locales, localeShortNames, type Locale } from '@/i18n/settings';

/**
 * Locale toggle. Strips the current locale prefix from the URL, prepends
 * the target locale, and pushes. Also persists choice as a cookie so the
 * root redirect (/) honors the user's last selection on revisit.
 */
export function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? '/';

  const swap = (target: Locale) => {
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
    // pathname includes the current locale segment, swap it.
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] && (locales as readonly string[]).includes(segments[0])) {
      segments[0] = target;
    } else {
      segments.unshift(target);
    }
    router.push('/' + segments.join('/'));
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-1 text-xs font-mono uppercase tracking-[0.2em]"
    >
      {locales.map((loc) => {
        const active = loc === currentLocale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => swap(loc)}
            aria-pressed={active}
            className={[
              'px-2 py-1 transition-colors cursor-pointer keep-latin',
              active
                ? 'text-gold-core'
                : 'text-text-faint hover:text-text-bright',
            ].join(' ')}
          >
            {localeShortNames[loc]}
          </button>
        );
      })}
    </div>
  );
}
