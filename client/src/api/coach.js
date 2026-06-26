import { apiRequest } from './client.js';

export function getMessages(token) {
  return apiRequest('/coach/messages', { token });
}

export function sendMessage(token, message) {
  return apiRequest('/coach/chat', { token, method: 'POST', body: { message } });
}

export function clearMessages(token) {
  return apiRequest('/coach/messages', { token, method: 'DELETE' });
}
