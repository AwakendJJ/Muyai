const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function normalizeApiUrl(url) {
  const trimmed = String(url || '').trim().replace(/\/$/, '');
  if (!trimmed) return '';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

function getApiCandidates() {
  const candidates = [normalizeApiUrl(rawApiUrl)].filter(Boolean);

  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      candidates.push('http://localhost:5000/api', 'http://127.0.0.1:5000/api');
    }
  }

  return [...new Set(candidates)];
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return { error: text || 'Request failed' };
}

export async function apiRequest(endpoint, options = {}) {
  const { token, body, headers: customHeaders, ...fetchOptions } = options;
  const candidates = getApiCandidates();
  let lastNetworkError = null;

  for (const baseUrl of candidates) {
    const headers = { ...customHeaders };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      // Retry on network-level failures for the next candidate URL.
      if (error instanceof TypeError) {
        lastNetworkError = error;
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    lastNetworkError?.message?.includes('Failed to fetch')
      ? 'Cannot reach API server. Make sure backend is running on http://localhost:5000.'
      : lastNetworkError?.message || 'Cannot reach API server.'
  );
}
