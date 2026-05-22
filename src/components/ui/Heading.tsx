import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Level = 1 | 2 | 3 | 4;
type Tone = 'bright' | 'primary' | 'muted';

const sizeFor: Record<Level, string> = {
  1: 'text-5xl sm:text-6xl lg:text-7xl leading-[1.05]',
  2: 'text-3xl sm:text-4xl lg:text-5xl leading-[1.1]',
  3: 'text-2xl sm:text-3xl leading-tight',
  4: 'text-xl sm:text-2xl leading-snug',
};

const toneFor: Record<Tone, string> = {
  bright: 'text-text-bright',
  primary: 'text-text-primary',
  muted: 'text-text-muted',
};

export function Heading({
  level = 2,
  tone = 'primary',
  display = true,
  className,
  children,
}: {
  level?: Level;
  tone?: Tone;
  /** Use serif display font (Cormorant). Set false for sans-serif headings. */
  display?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  return (
    <Tag
      className={cn(
        sizeFor[level],
        toneFor[tone],
        display ? 'font-display font-light' : 'font-sans font-medium',
        'text-balance',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
