import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'app' | 'essay' | 'narrow';
type Tag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';

const variants: Record<Variant, string> = {
  app: 'mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12',
  essay: 'mx-auto w-full max-w-3xl px-6 sm:px-8',
  narrow: 'mx-auto w-full max-w-2xl px-6 sm:px-8',
};

export function Container({
  children,
  variant = 'app',
  as = 'div',
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  as?: Tag;
  className?: string;
}) {
  const Component = as;
  return (
    <Component className={cn(variants[variant], className)}>
      {children}
    </Component>
  );
}
