import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-navy text-white hover:bg-navy-light shadow-sm',
        primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/20',
        purple: 'bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/20',
        pink: 'bg-accent-warm text-white hover:opacity-90',
        blue: 'bg-blue text-white hover:opacity-90',
        outline: 'border border-border bg-white text-dark hover:bg-muted',
        ghost: 'text-gray-text hover:bg-muted hover:text-dark',
        pill: 'rounded-full bg-navy text-white hover:bg-navy-light px-6',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
