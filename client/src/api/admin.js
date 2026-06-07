import { apiRequest } from './client.js';

export function getUsers(token) {
  return apiRequest('/admin/users', { token });
}

export function getUsage(token) {
  return apiRequest('/admin/usage', { token });
}
