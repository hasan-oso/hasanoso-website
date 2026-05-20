'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  AdminField,
  adminInputClass,
} from '@/components/admin/AdminField';
import {
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
} from '@/lib/firebase/settings';
import type { AdminSettings } from '@/lib/types/admin';

const schema = z.object({
  email: z.string().trim().email('Must be a valid email'),
  phone: z.string().trim().min(1, 'Required'),
  location: z.string().trim().min(1, 'Required'),
  github: z.string().trim().url('Must be a valid URL'),
  linkedin: z.string().trim().url('Must be a valid URL'),
  university: z.string().trim().min(1, 'Required'),
  responseTime: z.coerce.number().int().min(1).max(720),
});

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AdminSettings>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_SETTINGS,
  });

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings();
        reset(s);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [reset]);

  const onSubmit = async (data: AdminSettings) => {
    setSubmitting(true);
    try {
      await saveSettings(data);
      toast.success('Settings saved.');
      reset(data);
    } catch (err) {
      toast.error(`Save failed: ${(err as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="serif-display text-3xl text-primary mb-1">Settings</h1>
        <p className="text-secondary text-sm">
          Site-wide configuration. Used by the footer and contact page.
        </p>
      </header>

      {loading ? (
        <p className="text-tertiary text-sm font-mono">Loading…</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField
              label="Contact email"
              htmlFor="email"
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                className={adminInputClass + ' keep-latin'}
                {...register('email')}
              />
            </AdminField>
            <AdminField
              label="Contact phone"
              htmlFor="phone"
              error={errors.phone?.message}
              hint="Include country code"
            >
              <input
                id="phone"
                className={adminInputClass + ' keep-latin'}
                {...register('phone')}
              />
            </AdminField>
          </div>
          <AdminField
            label="Location"
            htmlFor="location"
            error={errors.location?.message}
          >
            <input
              id="location"
              className={adminInputClass}
              {...register('location')}
            />
          </AdminField>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField
              label="GitHub URL"
              htmlFor="github"
              error={errors.github?.message}
            >
              <input
                id="github"
                className={adminInputClass + ' keep-latin'}
                {...register('github')}
              />
            </AdminField>
            <AdminField
              label="LinkedIn URL"
              htmlFor="linkedin"
              error={errors.linkedin?.message}
            >
              <input
                id="linkedin"
                className={adminInputClass + ' keep-latin'}
                {...register('linkedin')}
              />
            </AdminField>
          </div>
          <AdminField
            label="University"
            htmlFor="university"
            error={errors.university?.message}
          >
            <input
              id="university"
              className={adminInputClass}
              {...register('university')}
            />
          </AdminField>
          <AdminField
            label="Response time (hours)"
            htmlFor="responseTime"
            error={errors.responseTime?.message}
            hint="Shown to visitors after they send a message"
          >
            <input
              id="responseTime"
              type="number"
              min={1}
              max={720}
              className={adminInputClass + ' w-32'}
              {...register('responseTime')}
            />
          </AdminField>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            {isDirty ? (
              <span className="text-tertiary text-xs font-mono">
                Unsaved changes
              </span>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-gold text-bg-base font-medium px-5 py-2.5 rounded-md hover:bg-gold-warm transition-colors disabled:opacity-50 text-sm"
            >
              <Save size={14} aria-hidden="true" />
              {submitting ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
