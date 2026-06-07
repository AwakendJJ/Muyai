import pool from '../config/db.js';

export async function countByUser(userId) {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS count FROM resumes WHERE user_id = ?',
    [userId]
  );
  return rows[0].count;
}

export async function create({ userId, filename, rawText }) {
  const [result] = await pool.query(
    'INSERT INTO resumes (user_id, filename, raw_text) VALUES (?, ?, ?)',
    [userId, filename, rawText]
  );
  return findById(result.insertId);
}

export async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, user_id, filename, raw_text, uploaded_at FROM resumes WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function findByUser(userId) {
  const [rows] = await pool.query(
    `SELECT r.id, r.filename, r.uploaded_at,
            COUNT(s.id) AS skill_count
     FROM resumes r
     LEFT JOIN skills s ON s.resume_id = r.id
     WHERE r.user_id = ?
     GROUP BY r.id
     ORDER BY r.uploaded_at DESC`,
    [userId]
  );
  return rows;
}

export async function belongsToUser(resumeId, userId) {
  const [rows] = await pool.query(
    'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
    [resumeId, userId]
  );
  return rows.length > 0;
}
