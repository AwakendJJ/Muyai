import pool from '../config/db.js';

const VALID_LEVELS = new Set(['beginner', 'intermediate', 'advanced']);

export async function bulkInsert(resumeId, skills) {
  if (!skills.length) return;

  const values = skills.map((skill) => [
    resumeId,
    skill.name,
    VALID_LEVELS.has(skill.proficiency) ? skill.proficiency : 'intermediate',
    skill.category || null,
  ]);

  await pool.query(
    'INSERT INTO skills (resume_id, skill_name, proficiency_level, category) VALUES ?',
    [values]
  );
}

export async function findByResumeId(resumeId) {
  const [rows] = await pool.query(
    `SELECT id, skill_name, proficiency_level, category
     FROM skills WHERE resume_id = ?
     ORDER BY
       FIELD(proficiency_level, 'advanced', 'intermediate', 'beginner'),
       skill_name`,
    [resumeId]
  );
  return rows;
}
