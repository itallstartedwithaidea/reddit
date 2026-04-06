import type { Env, RedditThread } from './types';

const SUBREDDITS = ['PPC', 'googleads', 'digital_marketing', 'adwords'];
const SEARCH_QUERIES = [
  'google ads',
  'PPC strategy',
  'adwords campaign',
  'google ads bidding',
  'performance max',
  'search campaign optimization',
  'google ads budget',
  'RSA headlines',
  'conversion tracking google ads',
  'google ads quality score',
];

export async function discoverThreads(env: Env, maxResults = 20): Promise<RedditThread[]> {
  const threads: RedditThread[] = [];
  const queryBatch = pickQueries(3);

  for (const query of queryBatch) {
    const subredditFilter = SUBREDDITS.map(s => `site:reddit.com/r/${s}`).join(' OR ');
    const searchQuery = `(${subredditFilter}) ${query}`;

    try {
      const results = await searchRedditViaSERP(env, searchQuery, 10);
      threads.push(...results);
    } catch (err) {
      console.error(`SearchAPI error for "${query}":`, (err as Error).message);
    }
  }

  const unique = deduplicateByRedditId(threads);
  console.log(`[ingest] Discovered ${unique.length} unique threads from ${queryBatch.length} queries`);
  return unique.slice(0, maxResults);
}

async function searchRedditViaSERP(env: Env, query: string, num: number): Promise<RedditThread[]> {
  const params = new URLSearchParams({
    engine: 'google',
    q: query,
    num: String(num),
    api_key: env.SEARCHAPI_KEY,
  });

  const resp = await fetch(`https://www.searchapi.io/api/v1/search?${params}`, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(15000),
  });

  if (!resp.ok) {
    if (resp.status === 429) {
      console.warn('[ingest] SearchAPI rate limited, backing off');
      return [];
    }
    throw new Error(`SearchAPI ${resp.status}: ${await resp.text().catch(() => 'no body')}`);
  }

  const data = await resp.json() as {
    organic_results?: Array<{
      title: string; link: string; snippet: string;
      position: number;
    }>;
  };

  return (data.organic_results || [])
    .filter(r => isRedditThread(r.link))
    .map(r => parseRedditResult(r));
}

function isRedditThread(url: string): boolean {
  return /reddit\.com\/r\/\w+\/comments\/\w+/.test(url);
}

function parseRedditResult(result: { title: string; link: string; snippet: string }): RedditThread {
  const url = result.link.split('?')[0];
  const redditId = extractRedditId(url);
  const subreddit = extractSubreddit(url);

  const title = result.title
    .replace(/\s*:\s*r\/\w+\s*$/, '')
    .replace(/\s*-\s*Reddit\s*$/, '')
    .trim();

  return {
    redditId,
    title,
    selftext: '',
    url,
    subreddit,
    score: 0,
    numComments: extractCommentCount(result.snippet),
    snippet: result.snippet,
  };
}

function extractRedditId(url: string): string {
  const match = url.match(/\/comments\/(\w+)/);
  return match?.[1] || url;
}

function extractSubreddit(url: string): string {
  const match = url.match(/\/r\/(\w+)/);
  return match?.[1] || 'PPC';
}

function extractCommentCount(snippet: string): number {
  const match = snippet.match(/(\d+)\s*comments?/i);
  return match ? parseInt(match[1], 10) : 0;
}

function pickQueries(count: number): string[] {
  const shuffled = [...SEARCH_QUERIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function deduplicateByRedditId(threads: RedditThread[]): RedditThread[] {
  const seen = new Set<string>();
  return threads.filter(t => {
    if (seen.has(t.redditId)) return false;
    seen.add(t.redditId);
    return true;
  });
}
