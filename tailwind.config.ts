import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0E1420',
          elevated: '#161D2E',
          subtle: '#1C2438',
        },
        border: {
          subtle: '#2A3349',
        },
        gold: {
          DEFAULT: '#C9A961',
          warm: '#D4AF37',
          soft: 'rgba(201, 169, 97, 0.08)',
        },
        accent: {
          DEFAULT: '#5EEAD4',
          soft: 'rgba(94, 234, 212, 0.05)',
        },
        text: {
          primary: '#ECE8DD',
          secondary: '#A8B0C0',
          tertiary: '#6B7388',
          muted: '#4A5168',
        },
      },
      textColor: {
        primary: '#ECE8DD',
        secondary: '#A8B0C0',
        tertiary: '#6B7388',
        muted: '#4A5168',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        arabic: ['var(--font-arabic)', 'IBM Plex Sans Arabic', 'Cairo', 'Tahoma', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        ultrawide: '0.3em',
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'gold-soft': '0 0 40px rgba(201, 169, 97, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
