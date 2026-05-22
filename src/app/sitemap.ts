import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/settings';
import { projectSlugs } from '@/data/projects';

export const dynamic = 'force-static';

const SITE = 'https://hasanoso.pages.dev';

/**
 * Builds the sitemap from the static set of locale routes + every
 * project detail page. Refreshed at build time, so it's always in sync
 * with the deployed export.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ['', 'about', 'work', 'contact'] as const;

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      const url = path ? `${SITE}/${locale}/${path}/` : `${SITE}/${locale}/`;
      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === '' ? 'monthly' : 'yearly',
        priority: path === '' ? 1 : 0.7,
      });
    }
    for (const slug of projectSlugs()) {
      entries.push({
        url: `${SITE}/${locale}/work/${slug}/`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
