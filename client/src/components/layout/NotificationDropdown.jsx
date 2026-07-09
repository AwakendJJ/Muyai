import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  CheckCircle2,
  FileText,
  Sparkles,
  Target,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as resumesApi from '../../api/resumes.js';
import * as applicationsApi from '../../api/applications.js';
import { Button } from '../ui/button.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.jsx';
import { cn } from '../../lib/utils';

const ICON_MAP = {
  resume: FileText,
  analysis: Target,
  jobs: Briefcase,
  system: Sparkles,
  success: CheckCircle2,
};

function buildNotifications({ hasResume, skillsCount, appStats, plan }) {
  const items = [];

  if (!hasResume) {
    items.push({
      id: 'upload-resume',
      type: 'resume',
      title: 'Upload your first resume',
      message: 'Get an AI skill profile in under a minute.',
      path: '/apps/resume',
      unread: true,
      time: 'Just now',
    });
  } else if (skillsCount > 0) {
    items.push({
      id: 'skills-ready',
      type: 'success',
      title: `${skillsCount} skills identified`,
      message: 'Your resume scan is complete. Run gap analysis next.',
      path: '/apps/analysis',
      unread: true,
      time: '2h ago',
    });
  }

  items.push({
    id: 'gap-tip',
    type: 'analysis',
    title: 'New role templates available',
    message: 'Compare your skills against Data Analyst and Software Developer roles.',
    path: '/apps/analysis',
    unread: !hasResume,
    time: '5h ago',
  });

  items.push({
    id: 'jobs-match',
    type: 'jobs',
    title: '12 new jobs match your profile',
    message: 'Remote and Ethiopia-based roles updated today.',
    path: '/apps/jobs',
    unread: false,
    time: '1d ago',
  });

  if (appStats?.interviewing > 0) {
    items.push({
      id: 'interview-reminder',
      type: 'success',
      title: 'Interview coming up',
      message: `You have ${appStats.interviewing} application${appStats.interviewing > 1 ? 's' : ''} in the interview stage.`,
      path: '/apps/applications',
      unread: true,
      time: '3h ago',
    });
  }

  if (plan === 'free') {
    items.push({
      id: 'upgrade-student',
      type: 'system',
      title: 'Unlock gap analysis',
      message: 'Upgrade to Student for unlimited scans and career recommendations.',
      path: '/#pricing',
      unread: false,
      time: '2d ago',
    });
  }

  return items.slice(0, 6);
}

export default function NotificationDropdown() {
  const { user, token } = useAuth();
  const [hints, setHints] = useState({ hasResume: false, skillsCount: 0, appStats: null });

  useEffect(() => {
    if (!token) return;

    Promise.all([
      resumesApi.listResumes(token),
      applicationsApi.getApplicationStats(token).catch(() => ({ data: { stats: null } })),
    ])
      .then(async ([resumeRes, appRes]) => {
        const resumes = resumeRes.data.resumes || [];
        let skillsCount = 0;

        if (resumes.length > 0) {
          const skillsRes = await resumesApi.getSkills(token, resumes[0].id);
          skillsCount = skillsRes.data.skills?.length || 0;
        }

        setHints({
          hasResume: resumes.length > 0,
          skillsCount,
          appStats: appRes.data.stats,
        });
      })
      .catch(() => {});
  }, [token]);

  const notifications = buildNotifications({
    ...hints,
    plan: user?.plan || 'free',
  });
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-text" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-warm text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm font-bold text-dark">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary-dark">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => {
            const Icon = ICON_MAP[n.type] || Bell;
            return (
              <DropdownMenuItem key={n.id} asChild className="cursor-pointer rounded-none p-0 focus:bg-muted">
                <Link
                  to={n.path}
                  className={cn(
                    'flex gap-3 px-4 py-3',
                    n.unread && 'bg-primary/[0.03]'
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                      n.unread ? 'bg-primary/10 text-primary' : 'bg-muted text-gray-text'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm', n.unread ? 'font-semibold text-dark' : 'font-medium')}>
                        {n.title}
                      </p>
                      {n.unread && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-warm" />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-gray-text">{n.message}</p>
                    <p className="mt-1 text-[10px] text-gray-text/80">{n.time}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs text-gray-text" disabled>
            Mark all as read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
