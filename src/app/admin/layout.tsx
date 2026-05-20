import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import '../globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminShell } from '@/components/admin/AdminLayout';

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-serif',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin — Hasan Oso',
  description: 'Site administration',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  const fontClasses = [sans.variable, serif.variable, mono.variable].join(' ');

  return (
    <html lang="en" dir="ltr" className={fontClasses} suppressHydrationWarning>
      <body className="min-h-screen bg-bg-base text-primary font-sans">
        <AuthProvider>
          <AdminShell>{children}</AdminShell>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#161D2E',
              color: '#ECE8DD',
              border: '1px solid #2A3349',
              fontSize: '13px',
              fontFamily: 'var(--font-sans), Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#C9A961', secondary: '#0E1420' },
            },
            error: {
              iconTheme: { primary: '#FF5C5C', secondary: '#0E1420' },
            },
          }}
        />
      </body>
    </html>
  );
}
