-- Muyai schema for Supabase (PostgreSQL)
-- Run this in Supabase SQL Editor: Dashboard → SQL → New query

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'student', 'pro')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resumes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  raw_text TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level TEXT NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')),
  category VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_skills_resume_id ON skills(resume_id);

CREATE TABLE IF NOT EXISTS job_roles (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  required_skills JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS skill_gaps (
  id BIGSERIAL PRIMARY KEY,
  resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  job_role_id BIGINT NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
  missing_skill VARCHAR(100) NOT NULL,
  importance_rank TEXT NOT NULL CHECK (importance_rank IN ('high', 'medium', 'low'))
);

CREATE INDEX IF NOT EXISTS idx_skill_gaps_resume_id ON skill_gaps(resume_id);

CREATE TABLE IF NOT EXISTS recommendations (
  id BIGSERIAL PRIMARY KEY,
  resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('career', 'course')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS idx_recommendations_resume_id ON recommendations(resume_id);

CREATE TABLE IF NOT EXISTS ai_usage (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at);
