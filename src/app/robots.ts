import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE = 'https://hasanoso.pages.dev';

/**
 * /robots.txt — blocks crawlers from /admin/* and points at the sitemap.
 * The admin layout also sets `robots: noindex` in its metadata as a
 * second layer of defence.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
