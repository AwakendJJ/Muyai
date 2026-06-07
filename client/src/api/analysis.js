import { apiRequest } from './client.js';

export function getJobRoles(token) {
  return apiRequest('/analysis/job-roles', { token });
}

export function runGapAnalysis(token, resumeId, jobRoleId) {
  return apiRequest('/analysis/gap', {
    method: 'POST',
    token,
    body: { resumeId, jobRoleId },
  });
}

export function getGaps(token, resumeId, jobRoleId) {
  const query = jobRoleId ? `?jobRoleId=${jobRoleId}` : '';
  return apiRequest(`/analysis/gaps/${resumeId}${query}`, { token });
}
