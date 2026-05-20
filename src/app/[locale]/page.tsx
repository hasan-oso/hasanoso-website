import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { CurrentlyBuilding } from '@/components/sections/CurrentlyBuilding';
import { fetchProjectBySlug, fetchProjects } from '@/lib/projects-source';
import { locales } from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const tMeta = await getTranslations({ locale, namespace: 'meta' });
  const tHero = await getTranslations({ locale, namespace: 'hero' });

  // Prefer NeuralCheck; if missing, fall back to the first featured/active project.
  const allProjects = await fetchProjects();
  const featured =
    (await fetchProjectBySlug('neuralcheck')) ??
    allProjects.find((p) => p.featured) ??
    allProjects[0] ??
    null;

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: tMeta('name'),
    jobTitle: tHero('subtitle'),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'OSTİM Technical University',
    },
    knowsLanguage: ['Arabic', 'Turkish', 'English'],
    knowsAbout: [
      'Artificial Intelligence',
      'Applied Machine Learning',
      'Graph Neural Networks',
      'Android Engineering',
    ],
    address: [
      { '@type': 'PostalAddress', addressLocality: 'Aleppo', addressCountry: 'SY' },
      { '@type': 'PostalAddress', addressLocality: 'Ankara', addressCountry: 'TR' },
    ],
    email: 'osohasan.ai@gmail.com',
    telephone: '+90-538-074-88-46',
    url: 'https://hasanoso.pages.dev',
    sameAs: [
      'https://linkedin.com/in/hasanoso',
      'https://github.com/hasanoso',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <CurrentlyBuilding project={featured} />
    </>
  );
}
