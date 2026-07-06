import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-muted text-dark',
        free: 'bg-accent-warm/10 text-accent-warm',
        student: 'bg-primary/10 text-primary-dark',
        pro: 'bg-blue/10 text-blue',
        success: 'bg-primary/10 text-primary-dark',
        warning: 'bg-accent/10 text-accent',
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
