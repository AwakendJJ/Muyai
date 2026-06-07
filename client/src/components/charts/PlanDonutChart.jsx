import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = { free: '#FF007A', student: '#9D00FF', pro: '#007AFF' };

export default function PlanDonutChart({ distribution }) {
  const data = [
    { name: 'Free', value: distribution?.free || 0, key: 'free' },
    { name: 'Student', value: distribution?.student || 0, key: 'student' },
    { name: 'Pro', value: distribution?.pro || 0, key: 'pro' },
  ].filter((d) => d.value > 0);

  if (!data.length) {
    return <p className="text-sm text-gray-text">No user data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={COLORS[entry.key]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
