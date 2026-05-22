'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import {
  getContentOverrides,
  saveContentOverrides,
  type ContentDoc,
  type ContentOverride,
} from '@/lib/firebase/content';
import { locales, localeNames, type Locale } from '@/i18n/settings';

type Status = 'idle' | 'saving' | 'saved' | 'error';

const sections: ReadonlyArray<{
  key: keyof ContentOverride;
  label: string;
  fields: ReadonlyArray<{
    key: string;
    label: string;
    multiline?: boolean;
  }>;
}> = [
  {
    key: 'hero',
    label: 'Hero',
    fields: [
      { key: 'topbar', label: 'Topbar' },
      { key: 'name', label: 'Name' },
      { key: 'subtitle', label: 'Subtitle', multiline: true },
      { key: 'intro', label: 'Intro', multiline: true },
    ],
  },
  {
    key: 'manifesto',
    label: 'Manifesto',
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'body', label: 'Body', multiline: true },
      { key: 'signature', label: 'Signature' },
    ],
  },
  {
    key: 'about',
    label: 'About',
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'lede', label: 'Lede', multiline: true },
    ],
  },
];

export default function AdminContentPage() {
  const [draft, setDraft] = useState<ContentDoc>({});
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    let alive = true;
    getContentOverrides()
      .then((data) => {
        if (alive && data) setDraft(data);
      })
      .catch((err) => console.error('Failed to load content', err))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  function updateField(
    locale: Locale,
    section: keyof ContentOverride,
    field: string,
    value: string,
  ) {
    setDraft((prev) => {
      const next: ContentDoc = { ...prev };
      const current = (next[locale] ?? {}) as ContentOverride;
      const sec = { ...(current[section] ?? {}) } as Record<string, string>;
      if (value.trim() === '') {
        delete sec[field];
      } else {
        sec[field] = value;
      }
      next[locale] = {
        ...current,
        [section]: Object.keys(sec).length > 0 ? sec : undefined,
      };
      return next;
    });
  }

  async function handleSave() {
    setStatus('saving');
    try {
      await saveContentOverrides(draft);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error('Save failed', err);
      setStatus('error');
    }
  }

  const localeContent = (draft[activeLocale] ?? {}) as ContentOverride;

  return (
    <AdminShell>
      <header className="border-b border-void-3 pb-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
          Content
        </p>
        <h1 className="mt-2 text-3xl font-display text-text-bright">
          Live text overrides
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-text-muted leading-relaxed">
          Edit copy that shows on the public site without redeploying. Empty
          fields fall back to the JSON files baked into the build.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setActiveLocale(loc)}
            className={[
              'px-3 py-1.5 text-xs font-mono uppercase tracking-[0.2em] rounded-sm transition-colors cursor-pointer',
              activeLocale === loc
                ? 'bg-gold-core text-void-0'
                : 'border border-void-3 text-text-muted hover:text-text-bright',
            ].join(' ')}
          >
            {localeNames[loc]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-12 text-text-faint text-sm">Loading…</p>
      ) : (
        <div className="mt-10 space-y-12">
          {sections.map((section) => {
            const sec = (localeContent[section.key] ?? {}) as Record<
              string,
              string
            >;
            return (
              <section key={section.key}>
                <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-gold-core/80">
                  {section.label}
                </h2>
                <div className="mt-4 grid gap-4">
                  {section.fields.map((field) => {
                    const value = sec[field.key] ?? '';
                    return (
                      <label key={field.key} className="block">
                        <span className="block text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint">
                          {field.label}
                        </span>
                        {field.multiline ? (
                          <textarea
                            value={value}
                            onChange={(e) =>
                              updateField(
                                activeLocale,
                                section.key,
                                field.key,
                                e.target.value,
                              )
                            }
                            rows={4}
                            dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                            className="mt-2 w-full resize-y rounded-sm border border-void-3 bg-void-0/60 px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-gold-core"
                          />
                        ) : (
                          <input
                            value={value}
                            onChange={(e) =>
                              updateField(
                                activeLocale,
                                section.key,
                                field.key,
                                e.target.value,
                              )
                            }
                            dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                            className="mt-2 w-full rounded-sm border border-void-3 bg-void-0/60 px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-gold-core"
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-12 flex items-center gap-6 border-t border-void-3 pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded-sm border border-gold-core bg-gold-core px-6 py-2 text-sm text-void-0 hover:bg-gold-warm hover:border-gold-warm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {status === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
        <span
          role="status"
          aria-live="polite"
          className="text-xs font-mono uppercase tracking-[0.2em]"
        >
          {status === 'saved' ? (
            <span className="text-neon-core">Saved.</span>
          ) : status === 'error' ? (
            <span className="text-red-400">Save failed.</span>
          ) : null}
        </span>
      </div>
    </AdminShell>
  );
}
