import { apiRequest } from './client.js';

export function listCoverLetters(token) {
  return apiRequest('/cover-letters', { token });
}

export function getCoverLetter(token, id) {
  return apiRequest(`/cover-letters/${id}`, { token });
}

export function generateCoverLetter(token, body) {
  return apiRequest('/cover-letters/generate', { token, method: 'POST', body });
}

export function updateCoverLetter(token, id, content) {
  return apiRequest(`/cover-letters/${id}`, { token, method: 'PATCH', body: { content } });
}

export function deleteCoverLetter(token, id) {
  return apiRequest(`/cover-letters/${id}`, { token, method: 'DELETE' });
}
