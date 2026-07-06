import supabase, { handleError } from '../config/db.js';

const DEFAULT_JOB_ROLES = [
  {
    title: 'Software Engineer',
    required_skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'Problem Solving'],
  },
  {
    title: 'Data Analyst',
    required_skills: ['SQL', 'Python', 'Excel', 'Data Visualization', 'Statistics', 'Tableau', 'Critical Thinking'],
  },
  {
    title: 'Product Manager',
    required_skills: ['Product Strategy', 'User Research', 'Agile', 'Communication', 'Roadmapping', 'Analytics', 'Leadership'],
  },
  {
    title: 'UX Designer',
    required_skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing', 'Design Systems'],
  },
  {
    title: 'DevOps Engineer',
    required_skills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform', 'Monitoring'],
  },
];

function normalizeRole(row) {
  if (!row) return null;
  return {
    ...row,
    required_skills: Array.isArray(row.required_skills)
      ? row.required_skills
      : JSON.parse(row.required_skills || '[]'),
  };
}

export async function ensureDefaults() {
  const existing = await findAll();
  if (existing.length > 0) {
    return existing;
  }

  const { data, error } = await supabase
    .from('job_roles')
    .insert(DEFAULT_JOB_ROLES)
    .select('id, title, required_skills');

  handleError(error, 'seed default job roles');
  return (data || []).map(normalizeRole);
}

export async function findAll() {
  const { data, error } = await supabase
    .from('job_roles')
    .select('id, title, required_skills')
    .order('title');

  handleError(error, 'findAll job roles');
  return (data || []).map(normalizeRole);
}

export async function findById(id) {
  const { data, error } = await supabase
    .from('job_roles')
    .select('id, title, required_skills')
    .eq('id', id)
    .maybeSingle();

  handleError(error, 'findById job role');
  return normalizeRole(data);
}
