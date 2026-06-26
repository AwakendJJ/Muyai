const PARSE_ETHIOJOBS_BASE =
  'https://api.parse.bot/scraper/18f6a24b-3d12-44c1-a231-3678d07f5169';

const REMOTIVE_API = 'https://remotive.com/api/remote-jobs';

const JOB_SOURCES = {
  remote: 'Remote (Remotive)',
  et: 'Ethiopia (EthioJobs)',
  za: 'South Africa',
  ng: 'Nigeria',
  ke: 'Kenya',
  gh: 'Ghana',
  eg: 'Egypt',
  tz: 'Tanzania',
  ug: 'Uganda',
  zm: 'Zambia',
};

function normalizeSkillName(name) {
  return String(name || '').toLowerCase().trim();
}

export function scoreJobMatch(job, skills) {
  if (!skills?.length) {
    return { match_score: 0, matched_skills: [] };
  }

  const text = `${job.title} ${job.description} ${job.categories || ''}`.toLowerCase();
  const matched = skills.filter((skill) => {
    const name = normalizeSkillName(skill.skill_name);
    if (!name) return false;
    return text.includes(name) || name.split(/\s+/).some((part) => part.length > 2 && text.includes(part));
  });

  const score = Math.min(100, Math.round((matched.length / skills.length) * 100));
  return {
    match_score: score,
    matched_skills: matched.map((s) => s.skill_name),
  };
}

function mapRemotiveJob(job) {
  return {
    id: `remotive-${job.id}`,
    title: job.title || 'Untitled role',
    company: job.company_name || 'Unknown company',
    location: job.candidate_required_location || 'Remote',
    description: job.description || '',
    categories: job.job_type || '',
    salary_min: null,
    salary_max: null,
    salary_label: job.salary || null,
    url: job.url || null,
    created_at: job.publication_date || null,
    source: 'remotive',
  };
}

function mapAdzunaJob(result) {
  return {
    id: String(result.id),
    title: result.title || 'Untitled role',
    company: result.company?.display_name || 'Unknown company',
    location: result.location?.display_name || 'Remote',
    description: result.description || '',
    salary_min: result.salary_min ?? null,
    salary_max: result.salary_max ?? null,
    url: result.redirect_url || null,
    created_at: result.created || null,
    source: 'adzuna',
  };
}

function mapEthioJobsItem(item) {
  const categories = (item.catalogs || []).map((c) => c.name).filter(Boolean).join(', ');
  const slug = item.slug;
  return {
    id: String(item.id),
    title: item.title || 'Untitled role',
    company: item.company?.name || 'Unknown company',
    location: item.state || 'Ethiopia',
    description: item.description || categories || '',
    categories,
    salary_min: null,
    salary_max: null,
    url: slug ? `https://ethiojobs.net/jobs/${slug}` : 'https://ethiojobs.net',
    created_at: item.date_published || null,
    source: 'ethiojobs',
  };
}

function unwrapEthioJobsPayload(body) {
  const data = body?.data?.data || body?.data || body;
  const items = data?.items || [];
  return {
    items,
    total: data?.total ?? items.length,
    page: data?.current_page ?? 1,
  };
}

/** Free public API — no key required. https://remotive.com/api */
async function fetchFromRemotive({ query, page = 1 }) {
  const params = new URLSearchParams();
  if (query) params.set('search', query);
  params.set('limit', '25');

  const url = params.toString() ? `${REMOTIVE_API}?${params}` : REMOTIVE_API;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Remotive job search failed (${response.status})`);
  }

  const data = await response.json();
  let jobs = (data.jobs || []).map(mapRemotiveJob);

  // Simple client-side pagination (Remotive returns full list)
  const perPage = 20;
  const start = (page - 1) * perPage;
  jobs = jobs.slice(start, start + perPage);

  return {
    jobs,
    total: data['job-count'] || jobs.length,
    page,
    demo_mode: false,
    provider: 'remotive',
    country: 'remote',
  };
}

async function fetchFromEthioJobs({ query, page = 1, limit = 20 }) {
  const apiKey = process.env.PARSE_API_KEY;

  if (!apiKey) {
    // Until EthioJobs API key is provided, use free Remotive listings
    const remotive = await fetchFromRemotive({ query: query || 'developer', page });
    return {
      ...remotive,
      provider: 'remotive',
      country: 'et',
      ethiojobs_pending: true,
    };
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    query: query || 'engineer',
  });

  const url = `${PARSE_ETHIOJOBS_BASE}/search_jobs?${params}`;
  const response = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`EthioJobs search failed (${response.status}): ${body.slice(0, 120)}`);
  }

  const body = await response.json();
  const { items, total, page: currentPage } = unwrapEthioJobsPayload(body);
  const jobs = items.map(mapEthioJobsItem);

  return {
    jobs,
    total,
    page: currentPage,
    demo_mode: false,
    provider: 'ethiojobs',
    country: 'et',
  };
}

async function fetchFromAdzuna({ query, location, country, page = 1 }) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    const remotive = await fetchFromRemotive({ query: query || location || 'developer', page });
    return { ...remotive, country };
  }

  const countryCode = country || 'za';
  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: '20',
    what: query || 'software',
    ...(location ? { where: location } : {}),
  });

  const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${page}?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Adzuna search failed (${response.status}): ${body.slice(0, 120)}`);
  }

  const data = await response.json();
  const jobs = (data.results || []).map(mapAdzunaJob);

  return {
    jobs,
    total: data.count || jobs.length,
    page,
    demo_mode: false,
    provider: 'adzuna',
    country: countryCode,
  };
}

async function fetchJobs({ query, location, country, page }) {
  const countryCode = country || process.env.JOBS_DEFAULT_COUNTRY || 'remote';

  if (countryCode === 'remote') {
    return fetchFromRemotive({ query: query || location, page });
  }

  if (countryCode === 'et') {
    return fetchFromEthioJobs({ query: query || location, page });
  }

  return fetchFromAdzuna({ query, location, country: countryCode, page });
}

export function getSupportedCountries() {
  return Object.entries(JOB_SOURCES).map(([code, label]) => ({ code, label }));
}

export async function searchJobs({ query, location, country, page }) {
  return fetchJobs({ query, location, country, page });
}

export async function matchJobsToSkills({ query, location, country, page, skills }) {
  const searchQuery = query || buildSearchQueryFromSkills(skills);
  const result = await fetchJobs({ query: searchQuery, location, country, page });

  const jobs = result.jobs
    .map((job) => {
      const { match_score, matched_skills } = scoreJobMatch(job, skills);
      return { ...job, match_score, matched_skills };
    })
    .sort((a, b) => b.match_score - a.match_score);

  return {
    ...result,
    jobs,
    search_query: searchQuery,
  };
}

export function buildSearchQueryFromSkills(skills) {
  if (!skills?.length) return 'developer';
  const top = skills
    .slice()
    .sort((a, b) => {
      const rank = { advanced: 0, intermediate: 1, beginner: 2 };
      return (rank[a.proficiency_level] ?? 1) - (rank[b.proficiency_level] ?? 1);
    })
    .slice(0, 4)
    .map((s) => s.skill_name);

  return top.join(' ');
}
