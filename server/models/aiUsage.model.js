import pool from '../config/db.js';

export async function log({ userId, feature, provider, model, tokensUsed }) {
  await pool.query(
    'INSERT INTO ai_usage (user_id, feature, provider, model, tokens_used) VALUES (?, ?, ?, ?, ?)',
    [userId, feature, provider, model, tokensUsed]
  );
}
