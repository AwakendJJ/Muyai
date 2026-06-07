import pool from '../config/db.js';

export async function findByResumeId(resumeId) {
  const [rows] = await pool.query(
    `SELECT id, type, title, description, url
     FROM recommendations
     WHERE resume_id = ?
     ORDER BY type, title`,
    [resumeId]
  );
  return rows;
}

export async function existsForResume(resumeId) {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS count FROM recommendations WHERE resume_id = ?',
    [resumeId]
  );
  return rows[0].count > 0;
}

export async function deleteByResumeId(resumeId) {
  await pool.query('DELETE FROM recommendations WHERE resume_id = ?', [resumeId]);
}

export async function bulkInsert(resumeId, items) {
  if (!items.length) return;

  const values = items.map((item) => [
    resumeId,
    item.type,
    item.title,
    item.description,
    item.url || null,
  ]);

  await pool.query(
    'INSERT INTO recommendations (resume_id, type, title, description, url) VALUES ?',
    [values]
  );
}
