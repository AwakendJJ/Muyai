const IMPORTANCE_COLORS = {
  high: 'bg-pink',
  medium: 'bg-orange',
  low: 'bg-blue',
};

export default function GapChart({ gaps }) {
  if (!gaps?.length) return null;

  const counts = gaps.reduce((acc, gap) => {
    const rank = gap.importance_rank || gap.importance;
    acc[rank] = (acc[rank] || 0) + 1;
    return acc;
  }, {});

  const total = gaps.length;
  const levels = [
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' },
  ];

  return (
    <div className="card-rounded p-6">
      <h3 className="font-bold">Gap importance breakdown</h3>
      <div className="mt-4 space-y-4">
        {levels.map(({ key, label }) => {
          const count = counts[key] || 0;
          const pct = total ? Math.round((count / total) * 100) : 0;

          return (
            <div key={key}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium capitalize">{label}</span>
                <span className="text-gray-text">{count} ({pct}%)</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${IMPORTANCE_COLORS[key]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
