import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function LocaleNotFound() {
  const t = await getTranslations('notFound');

  return (
    <section className="min-h-[70vh] flex items-center justify-center">
      <div className="container-narrow text-center py-24">
        <p className="font-mono text-[11px] uppercase tracking-ultrawide text-gold mb-6">
          404
        </p>
        <h1 className="serif-display text-4xl md:text-5xl text-primary mb-6">
          {t('title')}
        </h1>
        <p className="text-secondary mb-10 text-lg">{t('body')}</p>
        <Link
          href="/"
          className="inline-block bg-gold text-bg-base px-7 py-3 text-sm font-medium hover:bg-gold-warm transition-colors duration-200 rounded-sm"
        >
          {t('back')}
        </Link>
      </div>
    </section>
  );
}
