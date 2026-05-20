import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/settings';

const BASE_URL = 'https://hasanoso.pages.dev';

const paths = ['', '/about', '/projects', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}/`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: path === '' ? 1.0 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${path}/`]),
          ),
        },
      });
    }
  }

  return entries;
}
