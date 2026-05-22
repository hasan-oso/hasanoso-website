import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '../globals.css';
import { AuthProvider } from '@/components/admin/AuthContext';
import { AdminGuard } from '@/components/admin/AdminGuard';

const geistSans = Geist({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
});

/**
 * Admin section has its own html/body since it's outside the [locale] tree.
 * Always RTL Arabic — Hasan is the only user.
 */
export const metadata: Metadata = {
  title: 'لوحة التحكم · Hasan Oso',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-void-0 text-text-primary antialiased font-sans">
        <AuthProvider>
          <AdminGuard>{children}</AdminGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
