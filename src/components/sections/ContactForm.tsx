'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Inline check — avoids pulling Firebase SDK into the initial bundle.
// Both env vars are inlined at build time as string literals (or undefined).
const FIREBASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
);

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const MAIL_TO = 'osohasan.ai@gmail.com';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const tContact = useTranslations('contact');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [sent, setSent] = useState<false | 'firestore' | 'mailto'>(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t('errors.nameRequired')),
        email: z
          .string()
          .trim()
          .min(1, t('errors.emailRequired'))
          .email(t('errors.emailInvalid')),
        subject: z.string().trim().optional().default(''),
        message: z
          .string()
          .trim()
          .min(1, t('errors.messageRequired'))
          .min(10, t('errors.messageMin'))
          .max(500, t('errors.messageMax')),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = async (data: FormValues) => {
    const subject = data.subject?.trim()
      ? data.subject.trim()
      : 'Message from hasanoso.pages.dev';
    const body = `${data.message}\n\n— ${data.name} (${data.email})`;
    const mailtoUrl = `mailto:${MAIL_TO}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    if (FIREBASE_CONFIGURED) {
      try {
        const { submitMessage } = await import('@/lib/firebase/messages');
        await submitMessage({
          name: data.name.trim(),
          email: data.email.trim(),
          subject: data.subject?.trim() || undefined,
          message: data.message.trim(),
        });
        setSent('firestore');
        return;
      } catch (err) {
        // fall through to mailto if Firestore write fails
        console.warn('Firestore submit failed, falling back to mailto:', err);
      }
    }

    window.location.href = mailtoUrl;
    setSent('mailto');
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-sm border border-gold/40 bg-bg-elevated p-7 sm:p-8"
      >
        <div className="flex items-center gap-2 text-gold text-sm mb-3 keep-latin">
          <Check size={16} aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-widest">
            {t('successTitle')}
          </span>
        </div>
        <p
          className={cn(
            'text-secondary text-pretty leading-relaxed',
            isArabic ? 'font-arabic' : 'font-sans',
          )}
        >
          {sent === 'firestore'
            ? tContact('responseNote')
            : t('successBody')}
        </p>
        <button
          type="button"
          onClick={() => {
            reset();
            setSent(false);
          }}
          className="mt-5 text-sm text-gold hover:text-gold-warm transition-colors duration-200 link-underline"
        >
          ↺ {tContact('messageLabel')}
        </button>
      </motion.div>
    );
  }

  const labelClass =
    'block font-mono text-[11px] uppercase tracking-widest text-tertiary mb-2 keep-latin';
  const inputClass =
    'w-full bg-transparent border-0 border-b border-border-subtle px-1 py-3 text-primary placeholder:text-muted focus:outline-none focus:border-gold transition-colors duration-200 text-[15px]';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
      <Field
        htmlFor="name"
        label={t('name')}
        error={errors.name?.message}
        labelClass={labelClass}
      >
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder={t('namePlaceholder')}
          aria-invalid={!!errors.name}
          {...register('name')}
          className={inputClass}
        />
      </Field>

      <Field
        htmlFor="email"
        label={t('email')}
        error={errors.email?.message}
        labelClass={labelClass}
      >
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          aria-invalid={!!errors.email}
          {...register('email')}
          className={cn(inputClass, 'keep-latin')}
        />
      </Field>

      <Field
        htmlFor="message"
        label={t('message')}
        error={errors.message?.message}
        labelClass={labelClass}
      >
        <textarea
          id="message"
          rows={6}
          placeholder={t('messagePlaceholder')}
          aria-invalid={!!errors.message}
          {...register('message')}
          className={cn(inputClass, 'resize-none leading-relaxed py-3')}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex items-center gap-2 bg-gold text-bg-base px-6 py-3 text-sm font-medium hover:bg-gold-warm transition-colors duration-200 rounded-sm disabled:opacity-60"
      >
        <span>{isSubmitting ? t('sending') : t('send')}</span>
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0"
        />
      </button>
    </form>
  );
}

function Field({
  htmlFor,
  label,
  error,
  labelClass,
  children,
}: {
  htmlFor: string;
  label: string;
  error?: string;
  labelClass: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      <div className="min-h-[1.25rem] mt-1">
        {error ? (
          <p className="text-xs text-rose-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
