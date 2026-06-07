import supabase, { handleError } from '../config/db.js';

export async function log({ userId, feature, provider, model, tokensUsed }) {
  const { error } = await supabase.from('ai_usage').insert({
    user_id: userId,
    feature,
    provider,
    model,
    tokens_used: tokensUsed,
  });

  handleError(error, 'log ai usage');
}

export async function getSummary() {
  const { data, error } = await supabase
    .from('ai_usage')
    .select('feature, provider, model, tokens_used');

  handleError(error, 'getSummary ai usage');

  const rows = data || [];

  const totals = {
    total_calls: rows.length,
    total_tokens: rows.reduce((sum, row) => sum + (row.tokens_used || 0), 0),
  };

  const byFeatureMap = new Map();
  rows.forEach((row) => {
    const existing = byFeatureMap.get(row.feature) || { feature: row.feature, calls: 0, tokens: 0 };
    existing.calls += 1;
    existing.tokens += row.tokens_used || 0;
    byFeatureMap.set(row.feature, existing);
  });

  const byProviderMap = new Map();
  rows.forEach((row) => {
    const key = `${row.provider}|${row.model}`;
    const existing = byProviderMap.get(key) || {
      provider: row.provider,
      model: row.model,
      calls: 0,
      tokens: 0,
    };
    existing.calls += 1;
    existing.tokens += row.tokens_used || 0;
    byProviderMap.set(key, existing);
  });

  return {
    totals,
    by_feature: Array.from(byFeatureMap.values()).sort((a, b) => b.tokens - a.tokens),
    by_provider: Array.from(byProviderMap.values()).sort((a, b) => b.tokens - a.tokens),
  };
}

export async function getRecent(limit = 20) {
  const { data, error } = await supabase
    .from('ai_usage')
    .select('id, feature, provider, model, tokens_used, created_at, users(name, email)')
    .order('created_at', { ascending: false })
    .limit(limit);

  handleError(error, 'getRecent ai usage');

  return (data || []).map((row) => ({
    id: row.id,
    feature: row.feature,
    provider: row.provider,
    model: row.model,
    tokens_used: row.tokens_used,
    created_at: row.created_at,
    user_name: row.users?.name || 'Unknown',
    user_email: row.users?.email || '',
  }));
}
