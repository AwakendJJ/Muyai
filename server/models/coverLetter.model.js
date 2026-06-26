import supabase, { handleError } from '../config/db.js';

const LETTER_FIELDS = 'id, user_id, application_id, job_title, company, job_description, content, created_at, updated_at';

export async function findByUser(userId) {
  const { data, error } = await supabase
    .from('cover_letters')
    .select(LETTER_FIELDS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  handleError(error, 'findByUser cover letters');
  return data || [];
}

export async function findById(id) {
  const { data, error } = await supabase
    .from('cover_letters')
    .select(LETTER_FIELDS)
    .eq('id', id)
    .maybeSingle();

  handleError(error, 'findById cover letter');
  return data;
}

export async function belongsToUser(id, userId) {
  const { data, error } = await supabase
    .from('cover_letters')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  handleError(error, 'belongsToUser cover letter');
  return !!data;
}

export async function create(payload) {
  const { data, error } = await supabase
    .from('cover_letters')
    .insert({
      user_id: payload.userId,
      application_id: payload.applicationId || null,
      job_title: payload.jobTitle,
      company: payload.company,
      job_description: payload.jobDescription || null,
      content: payload.content,
    })
    .select(LETTER_FIELDS)
    .single();

  handleError(error, 'create cover letter');
  return data;
}

export async function updateContent(id, userId, content) {
  const { data, error } = await supabase
    .from('cover_letters')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select(LETTER_FIELDS)
    .single();

  handleError(error, 'update cover letter');
  return data;
}

export async function remove(id, userId) {
  const { error } = await supabase
    .from('cover_letters')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  handleError(error, 'remove cover letter');
}
