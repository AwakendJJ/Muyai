import { apiRequest } from './client.js';

export function listSessions(token) {
  return apiRequest('/interview/sessions', { token });
}

export function getSession(token, id) {
  return apiRequest(`/interview/sessions/${id}`, { token });
}

export function startSession(token, body) {
  return apiRequest('/interview/sessions', { token, method: 'POST', body });
}

export function submitAnswer(token, sessionId, body) {
  return apiRequest(`/interview/sessions/${sessionId}/answer`, { token, method: 'POST', body });
}

export function deleteSession(token, id) {
  return apiRequest(`/interview/sessions/${id}`, { token, method: 'DELETE' });
}
