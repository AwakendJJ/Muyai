import { apiRequest } from './client.js';

export function listApplications(token) {
  return apiRequest('/applications', { token });
}

export function getApplicationStats(token) {
  return apiRequest('/applications/stats', { token });
}

export function createApplication(token, body) {
  return apiRequest('/applications', { token, method: 'POST', body });
}

export function updateApplication(token, id, body) {
  return apiRequest(`/applications/${id}`, { token, method: 'PATCH', body });
}

export function deleteApplication(token, id) {
  return apiRequest(`/applications/${id}`, { token, method: 'DELETE' });
}
