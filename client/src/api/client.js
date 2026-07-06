// Dev uses Vite proxy (/api). Production must set VITE_API_URL on Vercel.
const rawApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : '');

function normalizeApiUrl(url) {
  const trimmed = String(url || '').trim().replace(/\/$/, '');
  if (!trimmed) return '';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

function getApiCandidates() {
  const primary = normalizeApiUrl(rawApiUrl);
  if (!primary) {
    throw new Error(
      'API URL is not configured. Set VITE_API_URL on Vercel to https://muyai.onrender.com/api and redeploy.'
    );
  }

  const candidates = [primary];

  if (typeof window !== 'undefined' && primary.startsWith('http')) {
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      candidates.push('http://127.0.0.1:5000/api', 'http://localhost:5000/api');
    }
  }

  return [...new Set(candidates)];
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return { error: 'Invalid JSON response from server' };
    }
  }

  const text = await response.text();
  return { error: text || 'Request failed' };
}

export async function apiRequest(endpoint, options = {}) {
  const {
    token,
    body,
    headers: customHeaders,
    timeoutMs = 30_000,
    allowUrlFallback = true,
    ...fetchOptions
  } = options;

  const isFormData = body instanceof FormData;
  const candidates = allowUrlFallback && !isFormData
    ? getApiCandidates()
    : [getApiCandidates()[0]];

  let lastNetworkError = null;

  for (const baseUrl of candidates) {
    const headers = { ...customHeaders };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (body && !isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(timeoutMs),
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError || error.name === 'AbortError' || error.name === 'TimeoutError') {
        lastNetworkError = error;
        continue;
      }
      throw error;
    }
  }

  if (lastNetworkError?.name === 'AbortError' || lastNetworkError?.name === 'TimeoutError') {
    throw new Error('Request timed out. The server may still be processing — refresh and check your resumes.');
  }

  throw new Error(
    lastNetworkError?.message?.toLowerCase().includes('fetch')
      ? import.meta.env.DEV
        ? 'Cannot reach API server. Make sure backend is running on port 5000, then refresh the page.'
        : 'Cannot reach API server. Check VITE_API_URL on Vercel and that Render is running.'
      : lastNetworkError?.message || 'Cannot reach API server.'
  );
}
