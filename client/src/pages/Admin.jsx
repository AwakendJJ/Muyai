import { useEffect, useState } from 'react';
import * as adminApi from '../api/admin.js';
import AppShell from '../components/layout/AppShell.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import PlanBadge from '../components/PlanBadge.jsx';
import PlanDonutChart from '../components/charts/PlanDonutChart.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import StatCard from '../components/StatCard.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const FEATURE_COLORS = {
  resume_parse: 'bg-blue',
  gap_analysis: 'bg-purple',
  recommendations: 'bg-orange',
};

export default function Admin() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [planDistribution, setPlanDistribution] = useState(null);
  const [usageSummary, setUsageSummary] = useState(null);
  const [recentUsage, setRecentUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      adminApi.getUsers(token),
      adminApi.getUsage(token),
    ])
      .then(([usersRes, usageRes]) => {
        setUsers(usersRes.data.users);
        setPlanDistribution(usersRes.data.plan_distribution);
        setUsageSummary(usageRes.data.summary);
        setRecentUsage(usageRes.data.recent);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <AppShell>
        <Skeleton className="h-10 w-56" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview — users and AI usage"
      />

      {error && <ErrorBanner message={error} className="mt-6" />}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={users.length} delay={0} />
        <StatCard label="AI calls" value={usageSummary?.totals?.total_calls || 0} delay={0.05} />
        <StatCard
          label="Tokens used"
          value={Number(usageSummary?.totals?.total_tokens || 0).toLocaleString()}
          delay={0.1}
        />
        <StatCard label="Pro users" value={planDistribution?.pro || 0} delay={0.15} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PlanDonutChart distribution={planDistribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI usage by feature</CardTitle>
          </CardHeader>
          <CardContent>
            {usageSummary?.by_feature?.length === 0 ? (
              <p className="text-sm text-gray-text">No AI usage recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {usageSummary?.by_feature?.map((row) => (
                  <div key={row.feature} className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${FEATURE_COLORS[row.feature] || 'bg-dark'}`} />
                      <span className="text-sm font-medium capitalize">{row.feature.replace('_', ' ')}</span>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{row.calls} calls</p>
                      <p className="text-gray-text">{Number(row.tokens).toLocaleString()} tokens</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Users</h2>
        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">Role</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-gray-text">{user.email}</td>
                    <td className="px-4 py-3">
                      <PlanBadge plan={user.plan} />
                    </td>
                    <td className="hidden px-4 py-3 capitalize sm:table-cell">{user.role}</td>
                    <td className="hidden px-4 py-3 text-gray-text md:table-cell">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Recent AI usage</h2>
        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Feature</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">Model</th>
                  <th className="px-4 py-3 font-semibold">Tokens</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUsage.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-text">
                      No AI usage recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentUsage.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium">{row.user_name}</p>
                        <p className="text-xs text-gray-text">{row.user_email}</p>
                      </td>
                      <td className="px-4 py-3 capitalize">{row.feature.replace('_', ' ')}</td>
                      <td className="hidden px-4 py-3 text-gray-text sm:table-cell">
                        {row.provider}/{row.model}
                      </td>
                      <td className="px-4 py-3">{row.tokens_used.toLocaleString()}</td>
                      <td className="hidden px-4 py-3 text-gray-text md:table-cell">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
