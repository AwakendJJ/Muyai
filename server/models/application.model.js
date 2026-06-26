import supabase, { handleError } from '../config/db.js';

const APPLICATION_FIELDS = 'id, user_id, job_title, company, location, job_url, status, notes, applied_at, created_at, updated_at';

export async function findByUser(userId) {
  const { data, error } = await supabase
    .from('applications')
    .select(APPLICATION_FIELDS)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  handleError(error, 'findByUser applications');
  return data || [];
}

export async function findById(id) {
  const { data, error } = await supabase
    .from('applications')
    .select(APPLICATION_FIELDS)
    .eq('id', id)
    .maybeSingle();

  handleError(error, 'findById application');
  return data;
}

export async function belongsToUser(id, userId) {
  const { data, error } = await supabase
    .from('applications')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  handleError(error, 'belongsToUser application');
  return !!data;
}

export async function create(payload) {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: payload.userId,
      job_title: payload.jobTitle,
      company: payload.company,
      location: payload.location || null,
      job_url: payload.jobUrl || null,
      status: payload.status || 'saved',
      notes: payload.notes || null,
      applied_at: payload.appliedAt || null,
    })
    .select(APPLICATION_FIELDS)
    .single();

  handleError(error, 'create application');
  return data;
}

export async function update(id, userId, payload) {
  const updates = { updated_at: new Date().toISOString() };

  if (payload.jobTitle !== undefined) updates.job_title = payload.jobTitle;
  if (payload.company !== undefined) updates.company = payload.company;
  if (payload.location !== undefined) updates.location = payload.location || null;
  if (payload.jobUrl !== undefined) updates.job_url = payload.jobUrl || null;
  if (payload.status !== undefined) updates.status = payload.status;
  if (payload.notes !== undefined) updates.notes = payload.notes || null;
  if (payload.appliedAt !== undefined) updates.applied_at = payload.appliedAt || null;

  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select(APPLICATION_FIELDS)
    .single();

  handleError(error, 'update application');
  return data;
}

export async function remove(id, userId) {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  handleError(error, 'remove application');
}

export async function getStats(userId) {
  const { data, error } = await supabase
    .from('applications')
    .select('status')
    .eq('user_id', userId);

  handleError(error, 'getStats applications');

  const rows = data || [];
  const stats = {
    total: rows.length,
    saved: 0,
    applied: 0,
    interviewing: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  };

  rows.forEach((row) => {
    if (stats[row.status] !== undefined) {
      stats[row.status] += 1;
    }
  });

  return stats;
}
