'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getContentOverrides,
  type ContentDoc,
} from '@/lib/firebase/content';
import { hasFirebaseConfig } from '@/lib/firebase/config';
import type { Locale } from '@/i18n/settings';

type LiveContent = {
  overrides: ContentDoc | null;
  ready: boolean;
};

const Ctx = createContext<LiveContent>({ overrides: null, ready: false });

/**
 * Loads the content overrides doc once on mount and exposes it.
 * SSR-safe: returns `{ overrides: null, ready: false }` until hydration.
 *
 * Cheap to mount everywhere — does nothing when Firebase isn't configured.
 */
export function LiveContentProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<ContentDoc | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasFirebaseConfig()) {
      setReady(true);
      return;
    }
    let alive = true;
    getContentOverrides()
      .then((data) => {
        if (alive) setOverrides(data);
      })
      .catch((err) => {
        console.error('Live content load failed', err);
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => ({ overrides, ready }), [overrides, ready]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Reads an override at `locale → section → field`. Returns null when no
 * override is set, so the caller can fall back to the build-time message.
 *
 * Path format: "section.field" where field can contain dots
 * (e.g. "currently.items.one.title" → section="currently", field="items.one.title")
 */
export function useLiveOverride(
  locale: Locale,
  path: string,
): string | null {
  const { overrides } = useContext(Ctx);
  if (!overrides) return null;
  const localeDoc = overrides[locale];
  if (!localeDoc) return null;
  const dotIdx = path.indexOf('.');
  if (dotIdx === -1) return null;
  const section = path.slice(0, dotIdx);
  const field = path.slice(dotIdx + 1);
  if (!section || !field) return null;
  const sec = localeDoc[section as keyof typeof localeDoc];
  if (!sec || typeof sec !== 'object') return null;
  const value = (sec as Record<string, unknown>)[field];
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}
