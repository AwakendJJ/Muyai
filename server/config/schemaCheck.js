import supabase from './db.js';

const PHASE5_TABLES = ['applications', 'cover_letters', 'interview_sessions', 'coach_messages'];

export async function checkPhase5Tables() {
  const results = {};

  for (const table of PHASE5_TABLES) {
    const { error } = await supabase.from(table).select('id').limit(1);
    results[table] = !error || !error.message?.includes('Could not find the table');
  }

  return {
    ready: Object.values(results).every(Boolean),
    tables: results,
  };
}
