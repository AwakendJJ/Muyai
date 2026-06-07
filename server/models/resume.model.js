import supabase, { handleError } from '../config/db.js';

export async function countByUser(userId) {
  const { count, error } = await supabase
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  handleError(error, 'countByUser');
  return count || 0;
}

export async function create({ userId, filename, rawText }) {
  const { data, error } = await supabase
    .from('resumes')
    .insert({ user_id: userId, filename, raw_text: rawText })
    .select('id, user_id, filename, raw_text, uploaded_at')
    .single();

  handleError(error, 'create resume');
  return data;
}

export async function findById(id) {
  const { data, error } = await supabase
    .from('resumes')
    .select('id, user_id, filename, raw_text, uploaded_at')
    .eq('id', id)
    .maybeSingle();

  handleError(error, 'findById resume');
  return data;
}

export async function findByUser(userId) {
  const { data, error } = await supabase
    .from('resumes')
    .select('id, filename, uploaded_at, skills(count)')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  handleError(error, 'findByUser resumes');

  return (data || []).map((resume) => ({
    id: resume.id,
    filename: resume.filename,
    uploaded_at: resume.uploaded_at,
    skill_count: resume.skills?.[0]?.count || 0,
  }));
}

export async function belongsToUser(resumeId, userId) {
  const { data, error } = await supabase
    .from('resumes')
    .select('id')
    .eq('id', resumeId)
    .eq('user_id', userId)
    .maybeSingle();

  handleError(error, 'belongsToUser');
  return !!data;
}
