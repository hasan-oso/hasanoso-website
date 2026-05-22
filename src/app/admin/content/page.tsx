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

type SectionDef = {
  key: keyof ContentOverride;
  label: string;
  fields: { key: string; label: string; multiline?: boolean }[];
};

const sections: SectionDef[] = [
  {
    key: 'hero',
    label: 'البطل (Hero)',
    fields: [
      { key: 'topbar', label: 'الشريط العلوي' },
      { key: 'name', label: 'الاسم' },
      { key: 'subtitle', label: 'العنوان الفرعي', multiline: true },
      { key: 'intro', label: 'المقدمة', multiline: true },
    ],
  },
  {
    key: 'manifesto',
    label: 'البيان (Manifesto)',
    fields: [
      { key: 'title', label: 'العنوان' },
      { key: 'body', label: 'النص', multiline: true },
      { key: 'signature', label: 'التوقيع' },
    ],
  },
  {
    key: 'currently',
    label: 'حالياً (Currently)',
    fields: [
      { key: 'label', label: 'التسمية' },
      { key: 'title', label: 'العنوان' },
      { key: 'items.one.title', label: 'المشروع ١ — العنوان' },
      { key: 'items.one.summary', label: 'المشروع ١ — الملخص', multiline: true },
      { key: 'items.one.status', label: 'المشروع ١ — الحالة' },
      { key: 'items.two.title', label: 'المشروع ٢ — العنوان' },
      { key: 'items.two.summary', label: 'المشروع ٢ — الملخص', multiline: true },
      { key: 'items.two.status', label: 'المشروع ٢ — الحالة' },
      { key: 'items.three.title', label: 'المشروع ٣ — العنوان' },
      { key: 'items.three.summary', label: 'المشروع ٣ — الملخص', multiline: true },
      { key: 'items.three.status', label: 'المشروع ٣ — الحالة' },
    ],
  },
  {
    key: 'selected',
    label: 'أعمال مختارة (Selected Work)',
    fields: [
      { key: 'label', label: 'التسمية' },
      { key: 'title', label: 'العنوان' },
      { key: 'subtitle', label: 'العنوان الفرعي', multiline: true },
      { key: 'viewAll', label: 'نص «عرض الكل»' },
    ],
  },
  {
    key: 'stack',
    label: 'الأدوات (Stack)',
    fields: [
      { key: 'label', label: 'التسمية' },
      { key: 'title', label: 'العنوان' },
      { key: 'groups.lang', label: 'تصنيف: اللغات' },
      { key: 'groups.ml', label: 'تصنيف: ML / AI' },
      { key: 'groups.infra', label: 'تصنيف: البنية التحتية' },
      { key: 'groups.ui', label: 'تصنيف: الواجهة' },
    ],
  },
  {
    key: 'about',
    label: 'من أنا (About)',
    fields: [
      { key: 'label', label: 'التسمية' },
      { key: 'title', label: 'العنوان' },
      { key: 'lede', label: 'المقدمة', multiline: true },
      { key: 'sections.background.heading', label: 'الخلفية — العنوان' },
      { key: 'sections.background.body', label: 'الخلفية — النص', multiline: true },
      { key: 'sections.now.heading', label: 'الآن — العنوان' },
      { key: 'sections.now.body', label: 'الآن — النص', multiline: true },
      { key: 'sections.approach.heading', label: 'المنهج — العنوان' },
      { key: 'sections.approach.body', label: 'المنهج — النص', multiline: true },
      { key: 'timeline.items.one.year', label: 'المسار الزمني ١ — السنة' },
      { key: 'timeline.items.one.text', label: 'المسار الزمني ١ — النص' },
      { key: 'timeline.items.two.year', label: 'المسار الزمني ٢ — السنة' },
      { key: 'timeline.items.two.text', label: 'المسار الزمني ٢ — النص' },
      { key: 'timeline.items.three.year', label: 'المسار الزمني ٣ — السنة' },
      { key: 'timeline.items.three.text', label: 'المسار الزمني ٣ — النص' },
      { key: 'timeline.items.four.year', label: 'المسار الزمني ٤ — السنة' },
      { key: 'timeline.items.four.text', label: 'المسار الزمني ٤ — النص' },
    ],
  },
  {
    key: 'nav',
    label: 'التنقل (Navigation)',
    fields: [
      { key: 'home', label: 'الرئيسية' },
      { key: 'about', label: 'من أنا' },
      { key: 'work', label: 'الأعمال' },
      { key: 'contact', label: 'التواصل' },
    ],
  },
  {
    key: 'footer',
    label: 'التذييل (Footer)',
    fields: [
      { key: 'tagline', label: 'الشعار' },
      { key: 'rights', label: 'الحقوق' },
      { key: 'builtWith', label: 'نص البناء' },
    ],
  },
  {
    key: 'work',
    label: 'صفحة الأعمال (Work)',
    fields: [
      { key: 'label', label: 'التسمية' },
      { key: 'title', label: 'العنوان' },
      { key: 'subtitle', label: 'العنوان الفرعي', multiline: true },
      { key: 'all', label: 'نص «الكل»' },
      { key: 'empty', label: 'رسالة فارغة' },
    ],
  },
  {
    key: 'contact',
    label: 'التواصل (Contact)',
    fields: [
      { key: 'label', label: 'التسمية' },
      { key: 'title', label: 'العنوان' },
      { key: 'lede', label: 'المقدمة', multiline: true },
      { key: 'form.name', label: 'حقل: الاسم' },
      { key: 'form.email', label: 'حقل: البريد' },
      { key: 'form.message', label: 'حقل: الرسالة' },
      { key: 'form.submit', label: 'زر الإرسال' },
      { key: 'form.namePlaceholder', label: 'placeholder: الاسم' },
      { key: 'form.emailPlaceholder', label: 'placeholder: البريد' },
      { key: 'form.messagePlaceholder', label: 'placeholder: الرسالة', multiline: true },
      { key: 'direct.label', label: 'تسمية البريد المباشر' },
      { key: 'direct.email', label: 'البريد المباشر' },
    ],
  },
  {
    key: 'projectDetail',
    label: 'تفاصيل المشروع (Project Detail)',
    fields: [
      { key: 'role', label: 'الدور' },
      { key: 'year', label: 'السنة' },
      { key: 'stack', label: 'الأدوات' },
      { key: 'links', label: 'الروابط' },
      { key: 'live', label: 'مباشر' },
      { key: 'repo', label: 'المستودع' },
      { key: 'backToWork', label: 'نص الرجوع' },
      { key: 'summary', label: 'الملخص' },
      { key: 'challenge', label: 'التحدي' },
      { key: 'approach', label: 'المنهج' },
      { key: 'outcome', label: 'النتيجة' },
    ],
  },
  {
    key: 'common',
    label: 'عام (Common)',
    fields: [
      { key: 'viewWork', label: 'عرض الأعمال' },
      { key: 'getInTouch', label: 'تواصل معي' },
      { key: 'readMore', label: 'اقرأ المزيد' },
      { key: 'viewProject', label: 'عرض المشروع' },
      { key: 'back', label: 'رجوع' },
      { key: 'scroll', label: 'تمرير' },
      { key: 'loading', label: 'تحميل' },
      { key: 'submitting', label: 'جارٍ الإرسال' },
      { key: 'sent', label: 'تم الإرسال' },
      { key: 'error', label: 'خطأ' },
    ],
  },
  {
    key: 'meta',
    label: 'بيانات الصفحة (Meta)',
    fields: [
      { key: 'name', label: 'الاسم' },
      { key: 'title', label: 'عنوان الصفحة' },
      { key: 'description', label: 'الوصف', multiline: true },
    ],
  },
];

export default function AdminContentPage() {
  const [draft, setDraft] = useState<ContentDoc>({});
  const [activeLocale, setActiveLocale] = useState<Locale>('ar');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>('idle');
  const [openSection, setOpenSection] = useState<string | null>('hero');

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
          المحتوى
        </p>
        <h1 className="mt-2 text-3xl font-display text-text-bright">
          تعديل محتوى الموقع
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-text-muted leading-relaxed">
          عدّل أي نص يظهر في الموقع مباشرة بدون إعادة نشر.
          الحقول الفارغة تستخدم النص الأصلي المضمّن في الكود.
        </p>
      </header>

      {/* Language tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setActiveLocale(loc)}
            className={[
              'px-3 py-1.5 text-xs font-mono tracking-[0.2em] rounded-sm transition-colors cursor-pointer',
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
        <p className="mt-12 text-text-faint text-sm">جارٍ التحميل…</p>
      ) : (
        <div className="mt-10 space-y-2">
          {sections.map((section) => {
            const sec = (localeContent[section.key] ?? {}) as Record<string, string>;
            const isOpen = openSection === section.key;
            const filledCount = section.fields.filter((f) => sec[f.key]?.trim()).length;

            return (
              <div key={section.key} className="border border-void-3 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : section.key)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-void-1/40 hover:bg-void-1/60 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-text-bright">
                    {section.label}
                  </span>
                  <span className="flex items-center gap-3">
                    {filledCount > 0 && (
                      <span className="text-[10px] font-mono text-gold-core">
                        {filledCount}/{section.fields.length}
                      </span>
                    )}
                    <span className="text-text-ghost text-xs">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4 grid gap-4 bg-void-0/30">
                    {section.fields.map((field) => {
                      const value = sec[field.key] ?? '';
                      const isArabic = activeLocale === 'ar';
                      return (
                        <label key={field.key} className="block">
                          <span className="block text-[10px] font-mono tracking-[0.3em] text-text-faint">
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
                              rows={3}
                              dir={isArabic ? 'rtl' : 'ltr'}
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
                              dir={isArabic ? 'rtl' : 'ltr'}
                              className="mt-2 w-full rounded-sm border border-void-3 bg-void-0/60 px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-gold-core"
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Save bar */}
      <div className="mt-12 flex items-center gap-6 border-t border-void-3 pt-6 sticky bottom-0 bg-void-0 py-4">
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
