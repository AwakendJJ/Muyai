import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  advanced: '#9D00FF',
  intermediate: '#007AFF',
  beginner: '#FF5C00',
};

export default function SkillProficiencyChart({ skills }) {
  const data = Object.entries(
    skills.reduce((acc, skill) => {
      acc[skill.proficiency_level] = (acc[skill.proficiency_level] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    key: name,
  }));

  if (!data.length) {
    return <p className="text-sm text-gray-text">No skill data to chart.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={COLORS[entry.key] || '#FF007A'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
