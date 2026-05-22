import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://hasanoso.pages.dev'),
  title: 'Hasan Oso — AI Engineer',
  description:
    'Hasan Oso. AI Engineer building tools for the new Syria. Based in Aleppo and Ankara.',
};

/**
 * Root layout is a passthrough. The locale layout under [locale] owns the
 * html/body element because lang/dir/fonts depend on the active locale.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
