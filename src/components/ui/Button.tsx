import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'neon';

const variants: Record<Variant, string> = {
  primary:
    'bg-gold-core text-void-0 border border-gold-core hover:bg-gold-warm hover:border-gold-warm shadow-[0_0_24px_rgba(201,169,97,0.12)]',
  ghost:
    'bg-transparent text-text-muted border border-text-ghost hover:border-gold-core hover:text-text-bright',
  neon:
    'bg-transparent text-neon-core border border-neon-core/60 hover:border-neon-core hover:shadow-[0_0_24px_rgba(0,229,255,0.5)] hover:text-neon-soft',
};

const base =
  'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium font-sans rounded-md ' +
  'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-core focus-visible:ring-offset-2 focus-visible:ring-offset-void-0 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: never;
  };

export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', className, children } = props;
  const classes = cn(base, variants[variant], className);

  if ('href' in props && props.href) {
    if (props.external) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props as AsButton;
  void _v;
  void _c;
  void _ch;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
