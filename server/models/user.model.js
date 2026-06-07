import supabase, { handleError } from '../config/db.js';

export async function findByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, password_hash, plan, role, created_at')
    .eq('email', email)
    .maybeSingle();

  handleError(error, 'findByEmail');
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

export async function create({ name, email, passwordHash }) {
  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, password_hash: passwordHash })
    .select('id, name, email, plan, role, created_at')
    .single();

  handleError(error, 'create user');
  return data;
}
