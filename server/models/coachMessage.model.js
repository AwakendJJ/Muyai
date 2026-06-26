import supabase, { handleError } from '../config/db.js';

export async function findByUser(userId, limit = 50) {
  const { data, error } = await supabase
    .from('coach_messages')
    .select('id, role, content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit);

  handleError(error, 'findByUser coach messages');
  return data || [];
}

export async function create(payload) {
  const { data, error } = await supabase
    .from('coach_messages')
    .insert({
      user_id: payload.userId,
      role: payload.role,
      content: payload.content,
    })
    .select('id, role, content, created_at')
    .single();

  handleError(error, 'create coach message');
  return data;
}

export async function clearForUser(userId) {
  const { error } = await supabase
    .from('coach_messages')
    .delete()
    .eq('user_id', userId);

  handleError(error, 'clear coach messages');
}
