import pool from '../config/db.js';

export async function findAll() {
  const [rows] = await pool.query(
    'SELECT id, title, required_skills FROM job_roles ORDER BY title'
  );
  return rows.map((row) => ({
    ...row,
    required_skills: typeof row.required_skills === 'string'
      ? JSON.parse(row.required_skills)
      : row.required_skills,
  }));
}

export async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, title, required_skills FROM job_roles WHERE id = ?',
    [id]
  );
  if (!rows[0]) return null;

  return {
    ...rows[0],
    required_skills: typeof rows[0].required_skills === 'string'
      ? JSON.parse(rows[0].required_skills)
      : rows[0].required_skills,
  };
}
