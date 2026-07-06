import { apiRequest } from './client.js';

const AI_TIMEOUT_MS = 120_000;

export function getMessages(token) {
  return apiRequest('/coach/messages', { token });
}

export function sendMessage(token, message) {
  return apiRequest('/coach/chat', {
    token,
    method: 'POST',
    body: { message },
    timeoutMs: AI_TIMEOUT_MS,
  });
}

export function clearMessages(token) {
  return apiRequest('/coach/messages', { token, method: 'DELETE' });
}
