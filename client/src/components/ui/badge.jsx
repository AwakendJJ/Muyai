import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-muted text-dark',
        free: 'bg-pink/10 text-pink',
        student: 'bg-purple/10 text-purple',
        pro: 'bg-blue/10 text-blue',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-orange/10 text-orange',
        locked: 'bg-muted text-gray-text',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
