const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint, options = {}) {
  const { token, ...fetchOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}
