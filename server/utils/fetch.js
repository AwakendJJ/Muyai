import { Agent, fetch as undiciFetch } from 'undici';

const longTimeoutAgent = new Agent({
  connectTimeout: 60_000,
  headersTimeout: 120_000,
  bodyTimeout: 120_000,
});

export async function fetchWithTimeout(url, options = {}) {
  const { timeoutMs = 120_000, ...fetchOptions } = options;

  return undiciFetch(url, {
    ...fetchOptions,
    dispatcher: longTimeoutAgent,
    signal: AbortSignal.timeout(timeoutMs),
  });
}
