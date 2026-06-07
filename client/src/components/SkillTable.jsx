const LEVEL_COLORS = {
  advanced: 'bg-purple/10 text-purple',
  intermediate: 'bg-blue/10 text-blue',
  beginner: 'bg-orange/10 text-orange',
};

export default function SkillTable({ skills }) {
  if (!skills?.length) {
    return (
      <p className="text-sm text-gray-text">No skills extracted yet.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-100 bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-semibold">Skill</th>
            <th className="px-4 py-3 font-semibold">Level</th>
            <th className="hidden px-4 py-3 font-semibold sm:table-cell">Category</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id || skill.skill_name} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3 font-medium">{skill.skill_name}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${LEVEL_COLORS[skill.proficiency_level] || LEVEL_COLORS.intermediate}`}>
                  {skill.proficiency_level}
                </span>
              </td>
              <td className="hidden px-4 py-3 text-gray-text sm:table-cell">{skill.category || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
