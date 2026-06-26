import { Lock } from 'lucide-react';
import { Badge } from './ui/badge.jsx';

export default function AppLockOverlay({ app, className = '' }) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Lock className="h-5 w-5 text-gray-text" />
      </div>
      <Badge variant="locked" className="mt-3">
        {app?.status === 'coming_soon' ? `Phase ${app.phase || 4}` : 'Locked'}
      </Badge>
      <p className="mt-2 max-w-[200px] text-center text-xs text-gray-text">
        {app?.status === 'coming_soon'
          ? `Coming in Phase ${app.phase || 4}`
          : `Requires ${app?.minPlan || 'pro'} plan`}
      </p>
    </div>
  );
}
