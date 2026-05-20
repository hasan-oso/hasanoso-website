import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://hasanoso.pages.dev'),
  title: 'Hasan Oso — AI Engineer',
  description:
    'Hasan Oso. AI Engineer and Applied Solutions Specialist. Aleppo · Ankara.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
