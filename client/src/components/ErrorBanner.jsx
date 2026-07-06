import { AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ErrorBanner({ message, className, children }) {
  if (!message && !children) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive',
        className
      )}
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">
        {message && <p>{message}</p>}
        {children}
      </div>
    </div>
  );
}
