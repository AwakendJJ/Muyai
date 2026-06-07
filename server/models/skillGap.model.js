import supabase, { handleError } from '../config/db.js';

const VALID_IMPORTANCE = new Set(['high', 'medium', 'low']);
const IMPORTANCE_ORDER = { high: 0, medium: 1, low: 2 };

function sortByImportance(gaps) {
  return gaps.sort((a, b) => {
    const diff = (IMPORTANCE_ORDER[a.importance_rank] ?? 1) - (IMPORTANCE_ORDER[b.importance_rank] ?? 1);
    if (diff !== 0) return diff;
    return a.missing_skill.localeCompare(b.missing_skill);
  });
}

export async function deleteByResumeAndRole(resumeId, jobRoleId) {
  const { error } = await supabase
    .from('skill_gaps')
    .delete()
    .eq('resume_id', resumeId)
    .eq('job_role_id', jobRoleId);

  handleError(error, 'deleteByResumeAndRole');
}

export async function bulkInsert(resumeId, jobRoleId, gaps) {
  if (!gaps.length) return;

  const rows = gaps.map((gap) => ({
    resume_id: resumeId,
    job_role_id: jobRoleId,
    missing_skill: gap.skill,
    importance_rank: VALID_IMPORTANCE.has(gap.importance) ? gap.importance : 'medium',
  }));

  const { error } = await supabase.from('skill_gaps').insert(rows);
  handleError(error, 'bulkInsert skill gaps');
}

export async function findByResumeAndRole(resumeId, jobRoleId) {
  const { data, error } = await supabase
    .from('skill_gaps')
    .select('id, missing_skill, importance_rank')
    .eq('resume_id', resumeId)
    .eq('job_role_id', jobRoleId);

  handleError(error, 'findByResumeAndRole');
  return sortByImportance(data || []);
}

export async function findByResumeId(resumeId) {
  const { data, error } = await supabase
    .from('skill_gaps')
    .select('id, missing_skill, importance_rank, job_role_id, job_roles(title)')
    .eq('resume_id', resumeId);

  handleError(error, 'findByResumeId skill gaps');

  const mapped = (data || []).map((row) => ({
    id: row.id,
    missing_skill: row.missing_skill,
    importance_rank: row.importance_rank,
    job_role_id: row.job_role_id,
    job_role_title: row.job_roles?.title || null,
  }));

  return mapped.sort((a, b) => {
    const diff = (IMPORTANCE_ORDER[a.importance_rank] ?? 1) - (IMPORTANCE_ORDER[b.importance_rank] ?? 1);
    return diff;
  });
}
