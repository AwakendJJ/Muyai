import { apiRequest } from './client.js';

const AI_TIMEOUT_MS = 120_000;

export function listSessions(token) {
  return apiRequest('/interview/sessions', { token });
}

export function getSession(token, id) {
  return apiRequest(`/interview/sessions/${id}`, { token });
}

export function startSession(token, body) {
  return apiRequest('/interview/sessions', {
    token,
    method: 'POST',
    body,
    timeoutMs: AI_TIMEOUT_MS,
  });
}

export function submitAnswer(token, sessionId, body) {
  return apiRequest(`/interview/sessions/${sessionId}/answer`, {
    token,
    method: 'POST',
    body,
    timeoutMs: AI_TIMEOUT_MS,
  });
}

export function deleteSession(token, id) {
  return apiRequest(`/interview/sessions/${id}`, { token, method: 'DELETE' });
}
