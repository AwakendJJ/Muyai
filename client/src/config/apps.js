import {
  LayoutDashboard,
  FileText,
  Search,
  Target,
  Briefcase,
  ClipboardList,
  Mail,
  Mic,
  GraduationCap,
  User,
  Settings,
} from 'lucide-react';

export const PLAN_RANK = { free: 0, student: 1, pro: 2 };

export const APP_GROUPS = [
  { id: 'overview', label: 'Overview' },
  { id: 'career', label: 'Career Tools' },
  { id: 'apply', label: 'Apply & Grow' },
  { id: 'coming', label: 'Coming Soon' },
  { id: 'account', label: 'Account' },
];

export const APPS = [
  {
    id: 'dashboard',
    path: '/apps/dashboard',
    label: 'Dashboard',
    description: 'Your career hub and quick stats',
    icon: LayoutDashboard,
    group: 'overview',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'resume',
    path: '/apps/resume',
    label: 'Resume Lab',
    description: 'Upload and analyze your resume',
    icon: FileText,
    group: 'career',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'analysis',
    path: '/apps/analysis',
    label: 'Gap Analysis',
    description: 'Compare skills against target roles',
    icon: Search,
    group: 'career',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'recommendations',
    path: '/apps/recommendations',
    label: 'Recommendations',
    description: 'Career paths and course suggestions',
    icon: Target,
    group: 'career',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'jobs',
    path: '/apps/jobs',
    label: 'Job Match',
    description: 'AI-powered job matching',
    icon: Briefcase,
    group: 'apply',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'applications',
    path: '/apps/applications',
    label: 'Applications',
    description: 'Track your job applications',
    icon: ClipboardList,
    group: 'apply',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'cover-letters',
    path: '/apps/cover-letters',
    label: 'Cover Letters',
    description: 'Generate tailored cover letters',
    icon: Mail,
    group: 'apply',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'interview',
    path: '/apps/interview',
    label: 'Interview Prep',
    description: 'Practice with AI interview coach',
    icon: Mic,
    group: 'apply',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'coach',
    path: '/apps/coach',
    label: 'Career Coach',
    description: 'Personalized career guidance',
    icon: GraduationCap,
    group: 'apply',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'profile',
    path: '/apps/profile',
    label: 'Profile',
    description: 'Your account and plan',
    icon: User,
    group: 'account',
    minPlan: 'free',
    status: 'live',
  },
  {
    id: 'admin',
    path: '/admin',
    label: 'Admin',
    description: 'Platform administration',
    icon: Settings,
    group: 'account',
    minPlan: 'free',
    status: 'live',
    adminOnly: true,
  },
];

export function getAppById(id) {
  return APPS.find((app) => app.id === id);
}

export function getAppsByGroup(groupId) {
  return APPS.filter((app) => app.group === groupId);
}

export function getLiveApps() {
  return APPS.filter((app) => app.status === 'live' && !app.adminOnly);
}

export function canAccessApp(app, userPlan) {
  if (app.status === 'coming_soon') return false;
  // Plan gating disabled — all live apps accessible (re-enable via VITE_PLAN_GATING_ENABLED)
  return true;
}

export function getLockMessage(app) {
  if (app.status === 'coming_soon') {
    return `Coming in Phase ${app.phase || '4'}`;
  }
  if (app.minPlan === 'pro') return 'Available on Pro plan';
  if (app.minPlan === 'student') return 'Available on Student plan';
  return 'Upgrade to unlock';
}
