'use client';

import { useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminField, adminInputClass, adminTextareaClass } from './AdminField';
import { TechChipInput } from './TechChipInput';
import type {
  AdminProject,
  AdminProjectInput,
  ProjectStatus,
} from '@/lib/types/admin';
import { locales, type Locale } from '@/i18n/settings';

const STATUSES: ProjectStatus[] = ['active', 'research', 'academic', 'archived'];

const translationSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  tagline: z.string().trim().min(1, 'Required'),
  teaser: z.string().trim().min(1, 'Required'),
  overview: z.string().trim().min(1, 'Required'),
  problem: z.string().trim().min(1, 'Required'),
  approach: z.string().trim().min(1, 'Required'),
  outcome: z.string().trim().min(1, 'Required'),
  lessons: z.string().trim().optional().default(''),
});

const formSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, 'Required')
      .regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers, and dashes only'),
    year: z.string().trim().min(1, 'Required'),
    status: z.enum(['active', 'research', 'academic', 'archived']),
    repoStatus: z.enum(['public', 'private']),
    repoUrl: z.string().trim().optional().default(''),
    privacyReason: z.object({
      en: z.string().trim().optional().default(''),
      ar: z.string().trim().optional().default(''),
      tr: z.string().trim().optional().default(''),
    }),
    tech: z.array(z.string()).min(1, 'Add at least one technology'),
    featured: z.boolean(),
    displayOrder: z.coerce.number().int().min(0),
    published: z.boolean(),
    translations: z.object({
      en: translationSchema,
      ar: translationSchema,
      tr: translationSchema,
    }),
  })
  .superRefine((data, ctx) => {
    if (data.repoStatus === 'public') {
      if (!data.repoUrl || !/^https?:\/\//.test(data.repoUrl)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['repoUrl'],
          message: 'Provide a full URL (https://…)',
        });
      }
    } else {
      for (const loc of ['en', 'ar', 'tr'] as const) {
        if (!data.privacyReason[loc]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['privacyReason', loc],
            message: 'Required when repo is private',
          });
        }
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

const EMPTY_TRANSLATION = {
  name: '',
  tagline: '',
  teaser: '',
  overview: '',
  problem: '',
  approach: '',
  outcome: '',
  lessons: '',
} as const;

const DEFAULT_VALUES: FormValues = {
  slug: '',
  year: new Date().getFullYear().toString(),
  status: 'active',
  repoStatus: 'private',
  repoUrl: '',
  privacyReason: { en: '', ar: '', tr: '' },
  tech: [],
  featured: false,
  displayOrder: 0,
  published: true,
  translations: {
    en: { ...EMPTY_TRANSLATION },
    ar: { ...EMPTY_TRANSLATION },
    tr: { ...EMPTY_TRANSLATION },
  },
};

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English (en)',
  ar: 'Arabic (ar)',
  tr: 'Turkish (tr)',
};

export function ProjectForm({
  initial,
  onSubmit,
  onDelete,
  submitting,
}: {
  initial?: AdminProject;
  onSubmit: (values: AdminProjectInput) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitting?: boolean;
}) {
  const defaultValues: FormValues = useMemo(() => {
    if (!initial) return DEFAULT_VALUES;
    return {
      slug: initial.slug,
      year: initial.year,
      status: initial.status,
      repoStatus: initial.repoStatus,
      repoUrl: initial.repoUrl ?? '',
      privacyReason: {
        en: initial.privacyReason?.en ?? '',
        ar: initial.privacyReason?.ar ?? '',
        tr: initial.privacyReason?.tr ?? '',
      },
      tech: initial.tech ?? [],
      featured: initial.featured ?? false,
      displayOrder: initial.displayOrder ?? 0,
      published: initial.published ?? true,
      translations: {
        en: { ...EMPTY_TRANSLATION, ...initial.translations.en, lessons: initial.translations.en.lessons ?? '' },
        ar: { ...EMPTY_TRANSLATION, ...initial.translations.ar, lessons: initial.translations.ar.lessons ?? '' },
        tr: { ...EMPTY_TRANSLATION, ...initial.translations.tr, lessons: initial.translations.tr.lessons ?? '' },
      },
    };
  }, [initial]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const repoStatus = watch('repoStatus');
  const tech = watch('tech');

  const submit: SubmitHandler<FormValues> = async (data) => {
    const payload: AdminProjectInput = {
      slug: data.slug,
      year: data.year,
      status: data.status,
      repoStatus: data.repoStatus,
      tech: data.tech,
      featured: data.featured,
      displayOrder: data.displayOrder,
      published: data.published,
      translations: {
        en: cleanTranslation(data.translations.en),
        ar: cleanTranslation(data.translations.ar),
        tr: cleanTranslation(data.translations.tr),
      },
    };
    if (data.repoStatus === 'public') {
      payload.repoUrl = data.repoUrl;
    } else {
      payload.privacyReason = {
        en: data.privacyReason.en,
        ar: data.privacyReason.ar,
        tr: data.privacyReason.tr,
      };
    }
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-10">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-tertiary hover:text-primary text-sm font-mono"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to projects
      </Link>

      <Section title="Basics">
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminField
            label="Slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint="URL fragment, e.g. neuralcheck"
          >
            <input id="slug" className={adminInputClass} {...register('slug')} />
          </AdminField>
          <AdminField label="Year" htmlFor="year" error={errors.year?.message}>
            <input id="year" className={adminInputClass} {...register('year')} />
          </AdminField>
          <AdminField label="Status" htmlFor="status" error={errors.status?.message}>
            <select id="status" className={adminInputClass} {...register('status')}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField
            label="Display order"
            htmlFor="displayOrder"
            error={errors.displayOrder?.message}
            hint="Lower numbers appear first"
          >
            <input
              id="displayOrder"
              type="number"
              min={0}
              className={adminInputClass}
              {...register('displayOrder')}
            />
          </AdminField>
        </div>
        <div className="flex flex-wrap items-center gap-6 mt-2">
          <Toggle label="Featured" {...register('featured')} />
          <Toggle label="Published" {...register('published')} />
        </div>
      </Section>

      <Section title="Repository">
        <AdminField label="Visibility" htmlFor="repoStatus">
          <select
            id="repoStatus"
            className={adminInputClass}
            {...register('repoStatus')}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </AdminField>
        {repoStatus === 'public' ? (
          <AdminField
            label="Repository URL"
            htmlFor="repoUrl"
            error={errors.repoUrl?.message}
          >
            <input
              id="repoUrl"
              className={adminInputClass}
              placeholder="https://github.com/…"
              {...register('repoUrl')}
            />
          </AdminField>
        ) : (
          <div className="space-y-3">
            <p className="text-tertiary text-xs">
              Explain why the repository is private (in each language).
            </p>
            {locales.map((loc) => (
              <AdminField
                key={loc}
                label={`Privacy reason · ${LOCALE_LABELS[loc]}`}
                htmlFor={`privacyReason.${loc}`}
                error={errors.privacyReason?.[loc]?.message}
              >
                <textarea
                  id={`privacyReason.${loc}`}
                  rows={2}
                  dir={loc === 'ar' ? 'rtl' : 'ltr'}
                  className={adminTextareaClass}
                  {...register(`privacyReason.${loc}`)}
                />
              </AdminField>
            ))}
          </div>
        )}
      </Section>

      <Section title="Tech stack">
        <TechChipInput
          value={tech}
          onChange={(next) => setValue('tech', next, { shouldDirty: true })}
          label="Technologies"
        />
        {errors.tech ? (
          <p className="text-rose-400 text-xs mt-1">{errors.tech.message}</p>
        ) : null}
      </Section>

      {locales.map((loc) => (
        <Section key={loc} title={`Content · ${LOCALE_LABELS[loc]}`}>
          <TranslationFields
            loc={loc}
            register={register}
            errors={errors.translations?.[loc]}
          />
        </Section>
      ))}

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-border-subtle">
        {onDelete ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Delete this project? This cannot be undone.')) {
                void onDelete();
              }
            }}
            className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors text-sm font-mono"
          >
            <Trash2 size={14} aria-hidden="true" />
            Delete project
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          {isDirty ? (
            <span className="text-tertiary text-xs font-mono">Unsaved changes</span>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-gold text-bg-base font-medium px-5 py-2.5 rounded-md hover:bg-gold-warm transition-colors disabled:opacity-50 text-sm"
          >
            <Save size={14} aria-hidden="true" />
            {submitting ? 'Saving…' : 'Save project'}
          </button>
        </div>
      </div>
    </form>
  );
}

function cleanTranslation(t: z.infer<typeof translationSchema>) {
  const out = { ...t };
  if (!out.lessons) delete (out as Partial<typeof out>).lessons;
  return out;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-mono text-[11px] uppercase tracking-widest text-gold keep-latin">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="inline-flex items-center gap-2.5 text-sm text-primary cursor-pointer select-none">
      <input
        type="checkbox"
        {...props}
        className="appearance-none w-9 h-5 rounded-full bg-bg-subtle border border-border-subtle relative cursor-pointer checked:bg-gold/30 checked:border-gold/60 before:content-[''] before:absolute before:top-0.5 before:start-0.5 before:w-3.5 before:h-3.5 before:bg-tertiary before:rounded-full before:transition-transform checked:before:translate-x-4 checked:before:bg-gold rtl:checked:before:-translate-x-4 transition-colors"
      />
      <span>{label}</span>
    </label>
  );
}

function TranslationFields({
  loc,
  register,
  errors,
}: {
  loc: Locale;
  register: ReturnType<typeof useForm<FormValues>>['register'];
  errors?: Partial<Record<keyof z.infer<typeof translationSchema>, { message?: string }>>;
}) {
  const dir = loc === 'ar' ? 'rtl' : 'ltr';
  const path = (field: keyof z.infer<typeof translationSchema>) =>
    `translations.${loc}.${field}` as const;
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <AdminField
          label="Name"
          htmlFor={`${loc}-name`}
          error={errors?.name?.message}
        >
          <input
            id={`${loc}-name`}
            dir={dir}
            className={adminInputClass}
            {...register(path('name'))}
          />
        </AdminField>
        <AdminField
          label="Tagline"
          htmlFor={`${loc}-tagline`}
          error={errors?.tagline?.message}
        >
          <input
            id={`${loc}-tagline`}
            dir={dir}
            className={adminInputClass}
            {...register(path('tagline'))}
          />
        </AdminField>
      </div>
      <AdminField
        label="Teaser (list-view summary)"
        htmlFor={`${loc}-teaser`}
        error={errors?.teaser?.message}
      >
        <textarea
          id={`${loc}-teaser`}
          rows={2}
          dir={dir}
          className={adminTextareaClass}
          {...register(path('teaser'))}
        />
      </AdminField>
      <AdminField
        label="Overview"
        htmlFor={`${loc}-overview`}
        error={errors?.overview?.message}
      >
        <textarea
          id={`${loc}-overview`}
          rows={3}
          dir={dir}
          className={adminTextareaClass}
          {...register(path('overview'))}
        />
      </AdminField>
      <AdminField
        label="The problem"
        htmlFor={`${loc}-problem`}
        error={errors?.problem?.message}
      >
        <textarea
          id={`${loc}-problem`}
          rows={4}
          dir={dir}
          className={adminTextareaClass}
          {...register(path('problem'))}
        />
      </AdminField>
      <AdminField
        label="The approach"
        htmlFor={`${loc}-approach`}
        error={errors?.approach?.message}
      >
        <textarea
          id={`${loc}-approach`}
          rows={4}
          dir={dir}
          className={adminTextareaClass}
          {...register(path('approach'))}
        />
      </AdminField>
      <AdminField
        label="The outcome"
        htmlFor={`${loc}-outcome`}
        error={errors?.outcome?.message}
      >
        <textarea
          id={`${loc}-outcome`}
          rows={3}
          dir={dir}
          className={adminTextareaClass}
          {...register(path('outcome'))}
        />
      </AdminField>
      <AdminField
        label="Lessons (optional)"
        htmlFor={`${loc}-lessons`}
        error={errors?.lessons?.message}
      >
        <textarea
          id={`${loc}-lessons`}
          rows={3}
          dir={dir}
          className={adminTextareaClass}
          {...register(path('lessons'))}
        />
      </AdminField>
    </div>
  );
}
