import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Warning: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function testConnection() {
  const { error } = await supabase.from('users').select('id').limit(1);
  if (error) throw error;
  return true;
}

export function handleError(error, context = 'Database error') {
  if (error) {
    console.error(context, error);
    throw error;
  }
}

export default supabase;
