import supabase, { handleError } from '../config/db.js';

function normalizeRole(row) {
  if (!row) return null;
  return {
    ...row,
    required_skills: Array.isArray(row.required_skills)
      ? row.required_skills
      : JSON.parse(row.required_skills || '[]'),
  };
}

export async function findAll() {
  const { data, error } = await supabase
    .from('job_roles')
    .select('id, title, required_skills')
    .order('title');

  handleError(error, 'findAll job roles');
  return (data || []).map(normalizeRole);
}

export async function findById(id) {
  const { data, error } = await supabase
    .from('job_roles')
    .select('id, title, required_skills')
    .eq('id', id)
    .maybeSingle();

  handleError(error, 'findById job role');
  return normalizeRole(data);
}
