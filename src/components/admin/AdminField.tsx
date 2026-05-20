'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function AdminField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="font-mono text-[11px] uppercase tracking-widest text-tertiary keep-latin"
      >
        {label}
      </label>
      {children}
      <div className="min-h-[1rem] flex items-center justify-between gap-2 text-[11px]">
        {error ? (
          <span className="text-rose-400" role="alert">
            {error}
          </span>
        ) : hint ? (
          <span className="text-tertiary">{hint}</span>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export const adminInputClass =
  'w-full bg-bg-elevated border border-border-subtle rounded-md px-3 py-2 text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors text-sm';

export const adminTextareaClass =
  'w-full bg-bg-elevated border border-border-subtle rounded-md px-3 py-2.5 text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors text-sm leading-relaxed resize-y';
