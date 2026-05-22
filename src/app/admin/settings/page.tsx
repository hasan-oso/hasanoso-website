'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import {
  getSiteSettings,
  saveSiteSettings,
  type SiteSettings,
} from '@/lib/firebase/settings';

type Status = 'idle' | 'saving' | 'saved' | 'error';

export default function AdminSettingsPage() {
  const [draft, setDraft] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    let alive = true;
    getSiteSettings()
      .then((s) => {
        if (alive && s) setDraft(s);
      })
      .catch((err) => console.error('Failed to load settings', err))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  async function handleSave() {
    setStatus('saving');
    try {
      await saveSiteSettings(draft);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error('Save failed', err);
      setStatus('error');
    }
  }

  return (
    <AdminShell>
      <header className="border-b border-void-3 pb-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80">
          الإعدادات
        </p>
        <h1 className="mt-2 text-3xl font-display text-text-bright">
          إعدادات الموقع
        </h1>
      </header>

      {loading ? (
        <p className="mt-12 text-text-faint text-sm">جارٍ التحميل…</p>
      ) : (
        <div className="mt-10 space-y-10">
          <Field
            label="وضع الصيانة"
            description="عند التفعيل، يعرض الموقع رسالة «تحت الصيانة» للزوّار."
          >
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(draft.maintenance)}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, maintenance: e.target.checked }))
                }
                className="h-4 w-4 accent-gold-core"
              />
              <span className="text-sm text-text-muted">
                {draft.maintenance ? 'مفعّل' : 'معطّل'}
              </span>
            </label>
          </Field>

          <Field
            label="بريد التواصل"
            description="تجاوز البريد المعروض في صفحة التواصل."
          >
            <input
              type="email"
              value={draft.contactEmail ?? ''}
              onChange={(e) =>
                setDraft((p) => ({ ...p, contactEmail: e.target.value }))
              }
              placeholder="hello@hasanoso.com"
              dir="ltr"
              className="w-full rounded-sm border border-void-3 bg-void-0/60 px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-gold-core keep-latin text-left"
            />
          </Field>

          <fieldset className="space-y-4">
            <legend className="text-sm font-mono uppercase tracking-[0.3em] text-gold-core/80">
              روابط التواصل الاجتماعي
            </legend>
            {(['github', 'linkedin', 'twitter'] as const).map((key) => (
              <Field key={key} label={key} description={undefined}>
                <input
                  type="url"
                  value={draft.social?.[key] ?? ''}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      social: { ...p.social, [key]: e.target.value },
                    }))
                  }
                  placeholder={`https://${key}.com/hasanoso`}
                  dir="ltr"
                  className="w-full rounded-sm border border-void-3 bg-void-0/60 px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-gold-core keep-latin text-left"
                />
              </Field>
            ))}
          </fieldset>
        </div>
      )}

      <div className="mt-12 flex items-center gap-6 border-t border-void-3 pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded-sm border border-gold-core bg-gold-core px-6 py-2 text-sm text-void-0 hover:bg-gold-warm hover:border-gold-warm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {status === 'saving' ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
        </button>
        <span
          role="status"
          aria-live="polite"
          className="text-xs font-mono tracking-[0.2em]"
        >
          {status === 'saved' ? (
            <span className="text-neon-core">تم الحفظ.</span>
          ) : status === 'error' ? (
            <span className="text-red-400">فشل الحفظ.</span>
          ) : null}
        </span>
      </div>
    </AdminShell>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint">
        {label}
      </p>
      {description ? (
        <p className="mt-1 text-xs text-text-ghost">{description}</p>
      ) : null}
      <div className="mt-3">{children}</div>
    </div>
  );
}
