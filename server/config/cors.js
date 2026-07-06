const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://muyai.vercel.app',
];

function normalizeOrigin(url) {
  return String(url || '').trim().replace(/\/$/, '');
}

export function getAllowedOrigins() {
  const origins = new Set(DEFAULT_ORIGINS.map(normalizeOrigin));

  if (process.env.FRONTEND_URL) {
    for (const url of process.env.FRONTEND_URL.split(',')) {
      const normalized = normalizeOrigin(url);
      if (normalized) origins.add(normalized);
    }
  }

  return origins;
}

export function corsOptionsDelegate(origin, callback) {
  if (!origin) {
    callback(null, true);
    return;
  }

  const normalized = normalizeOrigin(origin);
  const allowed = getAllowedOrigins();

  if (allowed.has(normalized) || /\.vercel\.app$/i.test(normalized)) {
    callback(null, true);
    return;
  }

  console.warn('CORS blocked origin:', origin);
  callback(null, false);
}

export const corsMiddlewareOptions = {
  origin: corsOptionsDelegate,
  credentials: true,
};
