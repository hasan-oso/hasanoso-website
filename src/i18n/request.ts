import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './settings';

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` (next-intl >= 3.22) returns the locale from the
  // `[locale]` route segment. Fall back to defaultLocale for routes
  // outside the locale tree (e.g. the root redirect page).
  const requested = await requestLocale;
  const locale =
    requested && locales.includes(requested as Locale)
      ? (requested as Locale)
      : defaultLocale;

  if (requested && !locales.includes(requested as Locale)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
