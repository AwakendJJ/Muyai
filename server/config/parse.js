/** Parse.bot EthioJobs scraper — MCP: muyai-vercel-app (Remotive); EthioJobs uses scraper below */
export const PARSE_DEFAULT_SCRAPER_ID = '5f4c3500-b87d-4bd3-8062-5312bf4c21c4';
export const PARSE_DEFAULT_JOB_ENDPOINT = 'search_jobs';

export function getParseConfig() {
  const scraperId = process.env.PARSE_SCRAPER_ID || PARSE_DEFAULT_SCRAPER_ID;
  const endpoint = process.env.PARSE_JOB_ENDPOINT || PARSE_DEFAULT_JOB_ENDPOINT;
  const apiKey = process.env.PARSE_API_KEY?.trim() || '';

  return {
    apiKey,
    scraperId,
    endpoint,
    baseUrl: `https://api.parse.bot/scraper/${scraperId}`,
    isConfigured: Boolean(apiKey),
  };
}
