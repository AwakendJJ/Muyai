import { useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import AppShell from '../../components/layout/AppShell.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { getAppById } from '../../config/apps.js';
import { Badge } from '../../components/ui/badge.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ComingSoon() {
  const { pathname } = useLocation();
  const appId = pathname.split('/').pop();
  const { user } = useAuth();
  const app = getAppById(appId) || {
    label: 'Coming Soon',
    description: 'This feature is under development.',
    phase: 4,
    minPlan: 'pro',
  };
  const Icon = app.icon || Lock;

  return (
    <AppShell>
      <PageHeader title={app.label} description={app.description} />

      <Card className="mt-10 max-w-lg">
        <CardContent className="flex flex-col items-center p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple/10">
            <Icon className="h-8 w-8 text-purple" />
          </div>
          <Badge variant="locked" className="mt-6">
            Coming in Phase {app.phase || 4}
          </Badge>
          <h2 className="mt-4 text-xl font-bold">{app.label}</h2>
          <p className="mt-2 text-sm text-gray-text">{app.description}</p>
          <p className="mt-4 text-sm text-gray-text">
            {app.status === 'coming_soon'
              ? `This module will be available in Phase ${app.phase || 4}. Stay tuned!`
              : `Requires ${app.minPlan} plan to access.`}
          </p>
          {user?.plan === 'free' && (
            <Button variant="purple" className="mt-6" asChild>
              <a href="/#pricing">View upgrade options</a>
            </Button>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
