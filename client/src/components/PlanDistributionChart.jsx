const PLAN_COLORS = {
  free: 'bg-pink',
  student: 'bg-purple',
  pro: 'bg-blue',
};

export default function PlanDistributionChart({ distribution }) {
  if (!distribution) return null;

  const total = Object.values(distribution).reduce((sum, n) => sum + n, 0);
  const plans = [
    { key: 'free', label: 'Free' },
    { key: 'student', label: 'Student' },
    { key: 'pro', label: 'Pro' },
  ];

  return (
    <div className="card-rounded p-6">
      <h3 className="font-bold">Plan distribution</h3>
      <div className="mt-4 space-y-4">
        {plans.map(({ key, label }) => {
          const count = distribution[key] || 0;
          const pct = total ? Math.round((count / total) * 100) : 0;

          return (
            <div key={key}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-gray-text">{count} ({pct}%)</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${PLAN_COLORS[key]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-gray-text">{total} total users</p>
    </div>
  );
}
