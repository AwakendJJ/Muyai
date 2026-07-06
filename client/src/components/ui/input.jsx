import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    className={cn('input-field', className)}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
