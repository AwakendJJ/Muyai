import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = { High: '#FF007A', Medium: '#FF5C00', Low: '#007AFF' };

export default function GapBarChart({ gaps }) {
  const data = [
    { name: 'High', count: gaps.filter((g) => (g.importance_rank || g.importance) === 'high').length },
    { name: 'Medium', count: gaps.filter((g) => (g.importance_rank || g.importance) === 'medium').length },
    { name: 'Low', count: gaps.filter((g) => (g.importance_rank || g.importance) === 'low').length },
  ];

  if (!gaps.length) return null;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={48}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
