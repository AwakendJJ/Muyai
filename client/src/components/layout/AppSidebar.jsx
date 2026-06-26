import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { APP_GROUPS, APPS, canAccessApp, getLockMessage } from '../../config/apps.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PlanBadge from '../PlanBadge.jsx';
import { Button } from '../ui/button.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip.jsx';
import { cn } from '../../lib/utils.js';

function NavItem({ app, onNavigate }) {
  const { user } = useAuth();
  const accessible = canAccessApp(app, user?.plan);
  const locked = !accessible;
  const Icon = app.icon;

  const content = (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
        locked ? 'cursor-not-allowed text-gray-text/60' : 'text-gray-text hover:bg-muted hover:text-dark'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{app.label}</span>
      {locked && <Lock className="h-3.5 w-3.5 shrink-0 opacity-60" />}
    </div>
  );

  if (locked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{content}</div>
        </TooltipTrigger>
        <TooltipContent>{getLockMessage(app)}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <NavLink to={app.path} onClick={onNavigate} className="block">
      {({ isActive }) => (
        <div className="relative">
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-xl bg-purple/10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <div
            className={cn(
              'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'text-purple' : 'text-gray-text hover:bg-muted hover:text-dark'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{app.label}</span>
          </div>
        </div>
      )}
    </NavLink>
  );
}

export default function AppSidebar({ onNavigate, className }) {
  const { user, logout } = useAuth();

  const visibleApps = APPS.filter((app) => !app.adminOnly || user?.role === 'admin');

  return (
    <TooltipProvider>
      <aside className={cn('flex h-full flex-col bg-white', className)}>
        <div className="border-b border-gray-100 px-5 py-6">
          <p className="text-xl font-bold tracking-tight">Muyai</p>
          <div className="mt-3">
            <PlanBadge plan={user?.plan} />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {APP_GROUPS.map((group) => {
            const groupApps = visibleApps.filter((app) => app.group === group.id);
            if (groupApps.length === 0) return null;

            return (
              <div key={group.id} className="mb-6">
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-text">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {groupApps.map((app) => (
                    <NavItem key={app.id} app={app} onNavigate={onNavigate} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-gray-text">{user?.email}</p>
          <Button variant="outline" className="mt-3 w-full" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
