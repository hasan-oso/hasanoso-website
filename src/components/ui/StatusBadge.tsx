'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { ProjectStatus } from '@/app/[locale]/projects/_data/projects';

const STATUS_COLOR: Record<ProjectStatus, string> = {
  active: 'text-gold',
  research: 'text-accent',
  academic: 'text-secondary',
  archived: 'text-muted',
};

const STATUS_DOT_BG: Record<ProjectStatus, string> = {
  active: 'bg-gold',
  research: 'bg-accent',
  academic: 'bg-secondary',
  archived: 'bg-muted',
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const t = useTranslations('projects.status');
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest',
        STATUS_COLOR[status],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-block w-1.5 h-1.5 rounded-full',
          STATUS_DOT_BG[status],
          status === 'active' && 'animate-pulse motion-reduce:animate-none',
        )}
      />
      {t(status)}
    </span>
  );
}
