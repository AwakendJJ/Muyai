/**
 * Apply Phase 5 tables to Supabase Postgres.
 * Requires SUPABASE_DB_PASSWORD in server/.env (Supabase → Settings → Database).
 * Run: node scripts/apply-phase5-schema.js
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, '../../database/phase5-only.sql');

function getConnectionConfig() {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  const password = process.env.SUPABASE_DB_PASSWORD;
  const ref = process.env.SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1];

  if (!password || !ref) {
    throw new Error(
      'Set SUPABASE_DB_PASSWORD (or DATABASE_URL) in server/.env — find it in Supabase → Project Settings → Database'
    );
  }

  return {
    host: `db.${ref}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password,
    ssl: { rejectUnauthorized: false },
  };
}

async function main() {
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new pg.Client(getConnectionConfig());

  await client.connect();
  console.log('Connected to Supabase Postgres');
  await client.query(sql);
  console.log('Phase 5 tables applied successfully');
  await client.end();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
