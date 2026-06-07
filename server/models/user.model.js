import pool from '../config/db.js';

export async function findByEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash, plan, role, created_at FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

export async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, plan, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function findAll() {
  const [rows] = await pool.query(
    'SELECT id, name, email, plan, role, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
}

export async function getPlanDistribution() {
  const [rows] = await pool.query(
    'SELECT plan, COUNT(*) AS count FROM users GROUP BY plan'
  );
  return rows;
}

export async function create({ name, email, passwordHash }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return findById(result.insertId);
}
