import { apiRequest } from './client.js';

export function syncUser(token, body = {}) {
  return apiRequest('/auth/sync', {
    method: 'POST',
    token,
    body,
  });
}

export function getMe(token) {
  return apiRequest('/auth/me', { token });
}
