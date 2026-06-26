import supabase, { handleError } from '../config/db.js';

const SESSION_FIELDS = 'id, user_id, job_title, company, questions, created_at';

export async function findByUser(userId) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select(SESSION_FIELDS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  handleError(error, 'findByUser interview sessions');
  return data || [];
}

export async function findById(id) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select(SESSION_FIELDS)
    .eq('id', id)
    .maybeSingle();

  handleError(error, 'findById interview session');
  return data;
}

export async function belongsToUser(id, userId) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  handleError(error, 'belongsToUser interview session');
  return !!data;
}

export async function create(payload) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .insert({
      user_id: payload.userId,
      job_title: payload.jobTitle,
      company: payload.company || null,
      questions: payload.questions || [],
    })
    .select(SESSION_FIELDS)
    .single();

  handleError(error, 'create interview session');
  return data;
}

export async function updateQuestions(id, userId, questions) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .update({ questions })
    .eq('id', id)
    .eq('user_id', userId)
    .select(SESSION_FIELDS)
    .single();

  handleError(error, 'update interview session');
  return data;
}

export async function remove(id, userId) {
  const { error } = await supabase
    .from('interview_sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  handleError(error, 'remove interview session');
}
