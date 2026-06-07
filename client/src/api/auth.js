import { apiRequest } from './client.js';

export function register(name, email, password) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

export function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getMe(token) {
  return apiRequest('/auth/me', { token });
}
