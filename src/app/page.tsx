'use client';

import { useEffect } from 'react';
import { locales, defaultLocale, type Locale } from '@/i18n/settings';

function detectLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const cookieMatch = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  const cookieLocale = cookieMatch?.[1];
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }

  const browserLangs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || ''];

  for (const lang of browserLangs) {
    const short = lang.toLowerCase().split('-')[0];
    if (short && (locales as readonly string[]).includes(short)) {
      return short as Locale;
    }
  }

  return defaultLocale;
}

export default function RootPage() {
  useEffect(() => {
    const locale = detectLocale();
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
    window.location.replace(`/${locale}/`);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Hasan Oso</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="refresh" content="0; url=/en/" />
        <style>{`
          body {
            margin: 0;
            background: #0E1420;
            color: #ECE8DD;
            font-family: Georgia, serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .wordmark {
            font-size: 1.5rem;
            letter-spacing: 0.05em;
            color: #C9A961;
          }
        `}</style>
      </head>
      <body>
        <div className="wordmark">Hasan Oso</div>
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en/" />
          <p>
            <a href="/en/" style={{ color: '#C9A961' }}>Continue to site</a>
          </p>
        </noscript>
      </body>
    </html>
  );
}
