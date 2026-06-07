CREATE DATABASE IF NOT EXISTS muyai;
USE muyai;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  plan ENUM('free', 'student', 'pro') NOT NULL DEFAULT 'free',
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  raw_text TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_resumes_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
  category VARCHAR(100),
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  INDEX idx_skills_resume_id (resume_id)
);

CREATE TABLE IF NOT EXISTS job_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  required_skills JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS skill_gaps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  job_role_id INT NOT NULL,
  missing_skill VARCHAR(100) NOT NULL,
  importance_rank ENUM('high', 'medium', 'low') NOT NULL,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
  INDEX idx_skill_gaps_resume_id (resume_id)
);

CREATE TABLE IF NOT EXISTS recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resume_id INT NOT NULL,
  type ENUM('career', 'course') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500),
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  INDEX idx_recommendations_resume_id (resume_id)
);

CREATE TABLE IF NOT EXISTS ai_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  feature VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  tokens_used INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ai_usage_user_id (user_id),
  INDEX idx_ai_usage_created_at (created_at)
);
