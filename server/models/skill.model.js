import supabase, { handleError } from '../config/db.js';

const VALID_LEVELS = new Set(['beginner', 'intermediate', 'advanced']);
const LEVEL_ORDER = { advanced: 0, intermediate: 1, beginner: 2 };

export async function bulkInsert(resumeId, skills) {
  if (!skills.length) return;

  const rows = skills.map((skill) => ({
    resume_id: resumeId,
    skill_name: skill.name,
    proficiency_level: VALID_LEVELS.has(skill.proficiency) ? skill.proficiency : 'intermediate',
    category: skill.category || null,
  }));

  const { error } = await supabase.from('skills').insert(rows);
  handleError(error, 'bulkInsert skills');
}

export async function findByResumeId(resumeId) {
  const { data, error } = await supabase
    .from('skills')
    .select('id, skill_name, proficiency_level, category')
    .eq('resume_id', resumeId);

  handleError(error, 'findByResumeId skills');

  return (data || []).sort((a, b) => {
    const levelDiff = (LEVEL_ORDER[a.proficiency_level] ?? 1) - (LEVEL_ORDER[b.proficiency_level] ?? 1);
    if (levelDiff !== 0) return levelDiff;
    return a.skill_name.localeCompare(b.skill_name);
  });
}
