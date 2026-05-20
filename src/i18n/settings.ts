export const locales = ['en', 'ar', 'tr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  tr: 'Türkçe',
};

export const localeShortNames: Record<Locale, string> = {
  en: 'EN',
  ar: 'AR',
  tr: 'TR',
};

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
  tr: 'ltr',
};
