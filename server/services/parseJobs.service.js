import { getParseConfig } from '../config/parse.js';

function unwrapParseBody(body) {
  if (!body || typeof body !== 'object') {
    return { items: [], total: 0, page: 1 };
  }

  if (body.status === 'error') {
    throw new Error(body.raw_output || body.message || 'Parse API returned an error');
  }

  const payload = body.status === 'success' && body.data != null ? body.data : body;
  const nested = payload?.data ?? payload;
  const items = nested?.items || payload?.items || [];

  return {
    items: Array.isArray(items) ? items : [],
    total: nested?.total ?? payload?.total ?? items.length,
    page: nested?.current_page ?? payload?.current_page ?? payload?.page ?? 1,
  };
}

async function callParseEndpoint({ query, page, limit }) {
  const { apiKey, baseUrl, endpoint } = getParseConfig();

  if (!apiKey) {
    throw new Error('PARSE_API_KEY is not configured');
  }

  const headers = {
    'X-API-Key': apiKey,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    query: query || 'engineer',
  });

  const getUrl = `${baseUrl}/${endpoint}?${params}`;
  let response = await fetch(getUrl, { headers: { 'X-API-Key': apiKey, Accept: 'application/json' } });

  if (response.status === 405 || response.status === 404) {
    response = await fetch(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        page,
        limit,
        query: query || 'engineer',
      }),
    });
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Parse EthioJobs failed (${response.status}): ${text.slice(0, 200)}`);
  }

  const body = await response.json();
  return unwrapParseBody(body);
}

export function mapEthioJobsItem(item) {
  const categories = (item.catalogs || []).map((c) => c.name).filter(Boolean).join(', ');
  const slug = item.slug;

  return {
    id: String(item.id),
    title: item.title || 'Untitled role',
    company: item.company?.name || 'Unknown company',
    location: item.state || item.location || 'Ethiopia',
    description: item.description || categories || '',
    categories,
    salary_min: null,
    salary_max: null,
    url: slug ? `https://ethiojobs.net/jobs/${slug}` : 'https://ethiojobs.net',
    created_at: item.date_published || item.created_at || null,
    source: 'ethiojobs',
  };
}

export async function searchEthioJobs({ query, page = 1, limit = 20 }) {
  const { items, total, page: currentPage } = await callParseEndpoint({ query, page, limit });
  return {
    jobs: items.map(mapEthioJobsItem),
    total,
    page: currentPage,
    demo_mode: false,
    provider: 'ethiojobs',
    country: 'et',
  };
}
