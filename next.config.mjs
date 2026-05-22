import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin tracing root to this project, otherwise Next picks up the user-level
  // package-lock.json and complains about multiple lockfiles.
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
  },
  // Three.js / R3F: silence noisy warnings from glsl-loaded modules
  // and let webpack bundle three's ESM cleanly.
  transpilePackages: ['three'],
};

export default withNextIntl(nextConfig);
