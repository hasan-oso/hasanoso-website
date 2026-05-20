import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Avatar({
  size = 96,
  className,
  ariaLabel = 'Hasan Oso',
}: {
  size?: number;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      className={cn('shrink-0 relative rounded-full overflow-hidden', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Gold border ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '1.5px solid #C9A961',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <Image
        src="/hasan-oso.jpg"
        alt={ariaLabel}
        width={size}
        height={size}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
}
