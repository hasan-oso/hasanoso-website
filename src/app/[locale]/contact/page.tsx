import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/sections/ContactForm';
import { locales, type Locale } from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: `${t('title')} — ${tMeta('name')}`,
    description: t('subtitle'),
  };
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });
  const isArabic = (locale as Locale) === 'ar';

  return (
    <div className="container-essay pt-10 sm:pt-16 pb-20 sm:pb-28">
      <header className="mb-12">
        <h1
          className={
            isArabic
              ? 'font-arabic text-4xl sm:text-5xl text-primary mb-4 text-balance'
              : 'serif-display text-4xl sm:text-5xl text-primary mb-4 text-balance'
          }
        >
          {t('title')}
        </h1>
        <p
          className={
            isArabic
              ? 'font-arabic text-secondary text-lg text-pretty leading-relaxed'
              : 'font-sans text-secondary text-lg text-pretty leading-relaxed'
          }
        >
          {t('subtitle')}
        </p>
        <div className="h-px w-12 bg-gold mt-8" aria-hidden="true" />
      </header>

      <section className="mb-14">
        <dl className="space-y-6 text-[15px]">
          <Pair
            label={t('details.mail')}
            value={t('values.mail')}
            href={`mailto:${t('values.mail')}`}
          />
          <Pair
            label={t('details.tel')}
            value={t('values.tel')}
            href={`tel:${t('values.tel').replace(/\s/g, '')}`}
          />
          <Pair
            label={t('details.location')}
            value={t('values.location')}
          />
        </dl>
      </section>

      <section className="border-t border-border-subtle pt-10">
        <p className="font-mono text-[11px] uppercase tracking-ultrawide text-tertiary mb-6 keep-latin">
          {t('messageLabel')}
        </p>
        <ContactForm />
        <p
          className={
            isArabic
              ? 'font-arabic mt-8 text-tertiary text-sm'
              : 'font-sans mt-8 text-tertiary text-sm'
          }
        >
          {t('responseNote')}
        </p>
      </section>
    </div>
  );
}

function Pair({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="text-primary keep-latin">{value}</span>
  );
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[11px] uppercase tracking-ultrawide text-tertiary keep-latin">
        {label}
      </dt>
      <dd>
        {href ? (
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="link-underline hover:text-gold transition-colors duration-200"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </dd>
    </div>
  );
}
