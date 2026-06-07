import { apiRequest } from './client.js';

export function getRecommendations(token, resumeId) {
  return apiRequest(`/recommendations/${resumeId}`, { token });
}

export function refreshRecommendations(token, resumeId) {
  return apiRequest(`/recommendations/${resumeId}/refresh`, {
    method: 'POST',
    token,
  });
}
