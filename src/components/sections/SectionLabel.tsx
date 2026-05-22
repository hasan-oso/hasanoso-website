import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Small uppercase eyebrow label with a leading rule. Use above section
 * titles to give the editorial layout its rhythm.
 */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.4em] text-gold-core',
        className,
      )}
    >
      <span className="h-px w-8 bg-gold-core/60" aria-hidden="true" />
      <span className="keep-latin">{children}</span>
    </div>
  );
}
