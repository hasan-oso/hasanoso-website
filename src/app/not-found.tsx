'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#0A0F1C',
          color: '#E8E4D9',
          fontFamily: 'Georgia, serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#C9A961' }}>
          404
        </h1>
        <p style={{ marginBottom: '2rem' }}>The page you are looking for is not here.</p>
        <Link
          href="/en/"
          style={{
            color: '#C9A961',
            textDecoration: 'none',
            border: '1px solid #C9A961',
            padding: '0.5rem 1.5rem',
            fontSize: '0.875rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Return Home
        </Link>
      </body>
    </html>
  );
}
