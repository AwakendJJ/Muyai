import AppShell from '../../components/layout/AppShell.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import PlanBadge from '../../components/PlanBadge.jsx';
import { Avatar, AvatarFallback } from '../../components/ui/avatar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { formatPlanPrice, SUBSCRIPTION_PLANS } from '../../config/pricing.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <AppShell>
      <PageHeader title="Profile" description="Your account and plan details" />

      <Card className="mt-8 max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <p className="text-sm text-gray-text">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
            <span className="text-sm font-medium">Plan</span>
            <PlanBadge plan={user?.plan} />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
            <span className="text-sm font-medium">Role</span>
            <span className="text-sm capitalize text-gray-text">{user?.role}</span>
          </div>
          {user?.created_at && (
            <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
              <span className="text-sm font-medium">Member since</span>
              <span className="text-sm text-gray-text">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Subscription plans (ETB)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm"
            >
              <span className="font-medium">{plan.name}</span>
              <span className="text-gray-text">
                {plan.price === 0 ? 'Free' : `${formatPlanPrice(plan)}/mo`}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
