import { cn } from '@/lib/utils';

const STROKE = '#C9A961';

export function ChipIllustration({
  size = 280,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 280 280"
      role="img"
      aria-label="Stylized chip illustration"
      className={cn(className)}
      fill="none"
    >
      <g opacity="0.95">
        {/* outer L-bracket corners */}
        <path d="M30 50 L30 30 L50 30" stroke={STROKE} strokeWidth="1" />
        <path d="M230 30 L250 30 L250 50" stroke={STROKE} strokeWidth="1" />
        <path d="M250 230 L250 250 L230 250" stroke={STROKE} strokeWidth="1" />
        <path d="M50 250 L30 250 L30 230" stroke={STROKE} strokeWidth="1" />

        {/* chip body */}
        <rect
          x="80"
          y="80"
          width="120"
          height="120"
          stroke={STROKE}
          strokeWidth="1.2"
        />
        <rect
          x="92"
          y="92"
          width="96"
          height="96"
          stroke={STROKE}
          strokeWidth="0.6"
          opacity="0.5"
        />

        {/* inner core */}
        <rect
          x="120"
          y="120"
          width="40"
          height="40"
          stroke={STROKE}
          strokeWidth="1"
        />
        <circle cx="140" cy="140" r="3" fill={STROKE} opacity="0.8" />

        {/* pins (24 total) */}
        {[100, 115, 130, 145, 160, 175].map((x) => (
          <line key={`t-${x}`} x1={x} y1="80" x2={x} y2="60" stroke={STROKE} strokeWidth="0.8" />
        ))}
        {[100, 115, 130, 145, 160, 175].map((x) => (
          <line key={`b-${x}`} x1={x} y1="200" x2={x} y2="220" stroke={STROKE} strokeWidth="0.8" />
        ))}
        {[100, 115, 130, 145, 160, 175].map((y) => (
          <line key={`l-${y}`} x1="80" y1={y} x2="60" y2={y} stroke={STROKE} strokeWidth="0.8" />
        ))}
        {[100, 115, 130, 145, 160, 175].map((y) => (
          <line key={`r-${y}`} x1="200" y1={y} x2="220" y2={y} stroke={STROKE} strokeWidth="0.8" />
        ))}

        {/* corner traces */}
        <path d="M60 60 L75 60 L75 75" stroke={STROKE} strokeWidth="0.6" opacity="0.5" />
        <path d="M220 60 L205 60 L205 75" stroke={STROKE} strokeWidth="0.6" opacity="0.5" />
        <path d="M60 220 L75 220 L75 205" stroke={STROKE} strokeWidth="0.6" opacity="0.5" />
        <path d="M220 220 L205 220 L205 205" stroke={STROKE} strokeWidth="0.6" opacity="0.5" />

        {/* connection nodes */}
        <circle cx="60" cy="60" r="2" fill={STROKE} />
        <circle cx="220" cy="60" r="2" fill={STROKE} />
        <circle cx="60" cy="220" r="2" fill={STROKE} />
        <circle cx="220" cy="220" r="2" fill={STROKE} />
      </g>
    </svg>
  );
}
