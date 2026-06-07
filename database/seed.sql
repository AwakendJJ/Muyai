-- Muyai seed data for Supabase
-- Password for all seed users: Password123!

INSERT INTO users (name, email, password_hash, plan, role) VALUES
  ('Admin User', 'admin@muyai.com', '$2b$10$9x66t9WyDnmHL5euQnspT.XMqTmSwIBaCu5LlsybAzjcivGhMHbTy', 'pro', 'admin'),
  ('Free User', 'free@muyai.com', '$2b$10$9x66t9WyDnmHL5euQnspT.XMqTmSwIBaCu5LlsybAzjcivGhMHbTy', 'free', 'user'),
  ('Student User', 'student@muyai.com', '$2b$10$9x66t9WyDnmHL5euQnspT.XMqTmSwIBaCu5LlsybAzjcivGhMHbTy', 'student', 'user'),
  ('Pro User', 'pro@muyai.com', '$2b$10$9x66t9WyDnmHL5euQnspT.XMqTmSwIBaCu5LlsybAzjcivGhMHbTy', 'pro', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO job_roles (title, required_skills) VALUES
  ('Software Engineer', '["JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs", "Problem Solving"]'),
  ('Data Analyst', '["SQL", "Python", "Excel", "Data Visualization", "Statistics", "Tableau", "Critical Thinking"]'),
  ('Product Manager', '["Product Strategy", "User Research", "Agile", "Communication", "Roadmapping", "Analytics", "Leadership"]'),
  ('UX Designer', '["Figma", "User Research", "Wireframing", "Prototyping", "Visual Design", "Usability Testing", "Design Systems"]'),
  ('DevOps Engineer', '["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Monitoring"]');
