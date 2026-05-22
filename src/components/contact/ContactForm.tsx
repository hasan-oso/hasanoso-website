'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitMessage } from '@/lib/firebase/messages';
import { hasFirebaseConfig } from '@/lib/firebase/config';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/settings';

type Status = 'idle' | 'submitting' | 'sent' | 'error' | 'no-config';

/**
 * Accessible contact form. Submits to Firestore when configured;
 * gracefully shows a "use email" fallback otherwise.
 */
export function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');
  const [status, setStatus] = useState<Status>(
    hasFirebaseConfig() ? 'idle' : 'no-config',
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    setError(null);
    setStatus('submitting');

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const body = String(data.get('message') ?? '').trim();

    if (!name || !email || !body) {
      setStatus('error');
      setError(tCommon('error'));
      return;
    }

    try {
      const result = await submitMessage({ name, email, body, locale });
      if (result === 'no-config') {
        setStatus('no-config');
        return;
      }
      setStatus('sent');
      form.reset();
    } catch (err) {
      console.error('Contact submit failed', err);
      setStatus('error');
      setError(tCommon('error'));
    }
  }

  if (status === 'no-config') {
    return (
      <div className="rounded-md border border-void-3 bg-void-1/40 p-6 text-sm text-text-muted">
        <p className="text-pretty">{t('notConfigured')}</p>
        <p className="mt-4">
          <a
            href={`mailto:${t('direct.email')}`}
            className="text-neon-core hover:text-neon-soft transition-colors keep-latin"
          >
            {t('direct.email')} ↗
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label
          htmlFor="contact-name"
          className="block text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80"
        >
          {t('form.name')}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={200}
          placeholder={t('form.namePlaceholder')}
          className="mt-2 w-full rounded-sm border border-void-3 bg-void-0/60 px-4 py-3 text-text-bright placeholder:text-text-ghost focus:outline-none focus:border-neon-core focus:shadow-[0_0_24px_rgba(0,229,255,0.18)] transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80"
        >
          {t('form.email')}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={200}
          inputMode="email"
          autoComplete="email"
          placeholder={t('form.emailPlaceholder')}
          className="mt-2 w-full rounded-sm border border-void-3 bg-void-0/60 px-4 py-3 text-text-bright placeholder:text-text-ghost focus:outline-none focus:border-neon-core focus:shadow-[0_0_24px_rgba(0,229,255,0.18)] transition-all keep-latin"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-[10px] font-mono uppercase tracking-[0.3em] text-gold-core/80"
        >
          {t('form.message')}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={6}
          placeholder={t('form.messagePlaceholder')}
          className="mt-2 w-full resize-y rounded-sm border border-void-3 bg-void-0/60 px-4 py-3 text-text-bright placeholder:text-text-ghost focus:outline-none focus:border-neon-core focus:shadow-[0_0_24px_rgba(0,229,255,0.18)] transition-all"
        />
      </div>

      <div className="flex items-center justify-between gap-6">
        <Button
          variant="neon"
          type="submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? tCommon('submitting') : t('form.submit')}
        </Button>

        <div
          role="status"
          aria-live="polite"
          className="text-xs font-mono uppercase tracking-[0.2em]"
        >
          {status === 'sent' ? (
            <span className="text-neon-core">{tCommon('sent')}</span>
          ) : status === 'error' ? (
            <span className="text-red-400">{error ?? tCommon('error')}</span>
          ) : null}
        </div>
      </div>
    </form>
  );
}
