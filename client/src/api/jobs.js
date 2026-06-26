import { apiRequest } from './client.js';

export function getJobCountries(token) {
  return apiRequest('/jobs/countries', { token });
}

export function searchJobs(token, { query, location, country, page } = {}) {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (location) params.set('location', location);
  if (country) params.set('country', country);
  if (page) params.set('page', String(page));
  const qs = params.toString();
  return apiRequest(`/jobs/search${qs ? `?${qs}` : ''}`, { token });
}

export function matchJobs(token, { resumeId, query, location, country, page } = {}) {
  const params = new URLSearchParams({ resumeId: String(resumeId) });
  if (query) params.set('query', query);
  if (location) params.set('location', location);
  if (country) params.set('country', country);
  if (page) params.set('page', String(page));
  return apiRequest(`/jobs/match?${params}`, { token });
}
