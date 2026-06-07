import { apiRequest } from './client.js';

export function listResumes(token) {
  return apiRequest('/resumes', { token });
}

export function uploadResume(token, file) {
  const formData = new FormData();
  formData.append('resume', file);

  return apiRequest('/resumes/upload', {
    method: 'POST',
    token,
    body: formData,
  });
}

export function getSkills(token, resumeId) {
  return apiRequest(`/resumes/${resumeId}/skills`, { token });
}
