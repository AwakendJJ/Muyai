import supabase, { handleError } from '../config/db.js';

export async function findByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, password_hash, firebase_uid, plan, role, created_at')
    .eq('email', email)
    .maybeSingle();

  handleError(error, 'findByEmail');
  return data;
}

export async function findByFirebaseUid(firebaseUid) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, plan, role, created_at, firebase_uid')
    .eq('firebase_uid', firebaseUid)
    .maybeSingle();

  handleError(error, 'findByFirebaseUid');
  return data;
}

export async function findById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, plan, role, created_at')
    .eq('id', id)
    .maybeSingle();

  handleError(error, 'findById');
  return data;
}

export async function findAll() {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, plan, role, created_at')
    .order('created_at', { ascending: false });

  handleError(error, 'findAll');
  return data || [];
}

export async function getPlanDistribution() {
  const users = await findAll();
  const counts = { free: 0, student: 0, pro: 0 };

  users.forEach((user) => {
    if (counts[user.plan] !== undefined) {
      counts[user.plan] += 1;
    }
  });

  return Object.entries(counts).map(([plan, count]) => ({ plan, count }));
}

export async function createFromFirebase({ name, email, firebaseUid }) {
  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, firebase_uid: firebaseUid })
    .select('id, name, email, plan, role, created_at, firebase_uid')
    .single();

  handleError(error, 'createFromFirebase');
  return data;
}

export async function linkFirebaseUid(userId, firebaseUid) {
  const { data, error } = await supabase
    .from('users')
    .update({ firebase_uid: firebaseUid })
    .eq('id', userId)
    .select('id, name, email, plan, role, created_at, firebase_uid')
    .single();

  handleError(error, 'linkFirebaseUid');
  return data;
}

export async function updateName(userId, name) {
  const { data, error } = await supabase
    .from('users')
    .update({ name })
    .eq('id', userId)
    .select('id, name, email, plan, role, created_at, firebase_uid')
    .single();

  handleError(error, 'updateName');
  return data;
}
