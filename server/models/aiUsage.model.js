import pool from '../config/db.js';

export async function log({ userId, feature, provider, model, tokensUsed }) {
  await pool.query(
    'INSERT INTO ai_usage (user_id, feature, provider, model, tokens_used) VALUES (?, ?, ?, ?, ?)',
    [userId, feature, provider, model, tokensUsed]
  );
}

export async function getSummary() {
  const [totals] = await pool.query(
    `SELECT
       COUNT(*) AS total_calls,
       COALESCE(SUM(tokens_used), 0) AS total_tokens
     FROM ai_usage`
  );

  const [byFeature] = await pool.query(
    `SELECT feature, COUNT(*) AS calls, COALESCE(SUM(tokens_used), 0) AS tokens
     FROM ai_usage GROUP BY feature ORDER BY tokens DESC`
  );

  const [byProvider] = await pool.query(
    `SELECT provider, model, COUNT(*) AS calls, COALESCE(SUM(tokens_used), 0) AS tokens
     FROM ai_usage GROUP BY provider, model ORDER BY tokens DESC`
  );

  return {
    totals: totals[0],
    by_feature: byFeature,
    by_provider: byProvider,
  };
}

export async function getRecent(limit = 20) {
  const [rows] = await pool.query(
    `SELECT a.id, a.feature, a.provider, a.model, a.tokens_used, a.created_at,
            u.name AS user_name, u.email AS user_email
     FROM ai_usage a
     JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
}
