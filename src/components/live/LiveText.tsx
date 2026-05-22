'use client';

import { useLiveOverride } from './LiveContentProvider';
import type { Locale } from '@/i18n/settings';

/**
 * Renders Firestore-overridden text when available, falling back to the
 * server-rendered string. Use sparingly — only on fields the admin can
 * actually edit, otherwise prefer plain server-rendered translations.
 */
export function LiveText({
  locale,
  path,
  fallback,
  className,
  as: Tag = 'span',
}: {
  locale: Locale;
  path: string;
  fallback: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'div';
}) {
  const override = useLiveOverride(locale, path);
  const text = override ?? fallback;
  const Component = Tag as 'span';
  return <Component className={className}>{text}</Component>;
}
