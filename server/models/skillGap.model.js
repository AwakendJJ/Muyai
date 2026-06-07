import pool from '../config/db.js';

const VALID_IMPORTANCE = new Set(['high', 'medium', 'low']);

export async function deleteByResumeAndRole(resumeId, jobRoleId) {
  await pool.query(
    'DELETE FROM skill_gaps WHERE resume_id = ? AND job_role_id = ?',
    [resumeId, jobRoleId]
  );
}

export async function bulkInsert(resumeId, jobRoleId, gaps) {
  if (!gaps.length) return;

  const values = gaps.map((gap) => [
    resumeId,
    jobRoleId,
    gap.skill,
    VALID_IMPORTANCE.has(gap.importance) ? gap.importance : 'medium',
  ]);

  await pool.query(
    'INSERT INTO skill_gaps (resume_id, job_role_id, missing_skill, importance_rank) VALUES ?',
    [values]
  );
}

export async function findByResumeAndRole(resumeId, jobRoleId) {
  const [rows] = await pool.query(
    `SELECT id, missing_skill, importance_rank
     FROM skill_gaps
     WHERE resume_id = ? AND job_role_id = ?
     ORDER BY FIELD(importance_rank, 'high', 'medium', 'low'), missing_skill`,
    [resumeId, jobRoleId]
  );
  return rows;
}

export async function findByResumeId(resumeId) {
  const [rows] = await pool.query(
    `SELECT sg.id, sg.missing_skill, sg.importance_rank, sg.job_role_id,
            jr.title AS job_role_title
     FROM skill_gaps sg
     JOIN job_roles jr ON jr.id = sg.job_role_id
     WHERE sg.resume_id = ?
     ORDER BY FIELD(sg.importance_rank, 'high', 'medium', 'low')`,
    [resumeId]
  );
  return rows;
}
