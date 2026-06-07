import supabase, { handleError } from '../config/db.js';

export async function findByResumeId(resumeId) {
  const { data, error } = await supabase
    .from('recommendations')
    .select('id, type, title, description, url')
    .eq('resume_id', resumeId)
    .order('type')
    .order('title');

  handleError(error, 'findByResumeId recommendations');
  return data || [];
}

export async function existsForResume(resumeId) {
  const { count, error } = await supabase
    .from('recommendations')
    .select('*', { count: 'exact', head: true })
    .eq('resume_id', resumeId);

  handleError(error, 'existsForResume');
  return (count || 0) > 0;
}

export async function deleteByResumeId(resumeId) {
  const { error } = await supabase
    .from('recommendations')
    .delete()
    .eq('resume_id', resumeId);

  handleError(error, 'deleteByResumeId');
}

export async function bulkInsert(resumeId, items) {
  if (!items.length) return;

  const rows = items.map((item) => ({
    resume_id: resumeId,
    type: item.type,
    title: item.title,
    description: item.description,
    url: item.url || null,
  }));

  const { error } = await supabase.from('recommendations').insert(rows);
  handleError(error, 'bulkInsert recommendations');
}
