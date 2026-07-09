import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Logo({ className, to = '/', showText = true, size = 'default', tagline, taglineClassName }) {
  const iconSize = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const textSize = size === 'sm' ? 'text-lg' : 'text-xl';

  const content = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className={cn('flex shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/25', iconSize)}>
        <Sparkles className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </span>
      {showText && (
        <span className="flex min-w-0 flex-col">
          <span className={cn('font-display font-bold tracking-tight', textSize)}>Muyai</span>
          {tagline && (
            <span
              className={cn(
                'mt-0.5 text-[10px] font-medium leading-snug text-gray-text sm:text-xs',
                taglineClassName
              )}
            >
              {tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (to) {
    return <Link to={to} className="inline-flex">{content}</Link>;
  }

  return content;
}
