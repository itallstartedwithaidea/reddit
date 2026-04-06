import type { Env, RedditThread } from './types';
import { getPostByRedditId } from './db';

const BLOCKLIST = [
  'nsfw', 'porn', 'onlyfans', 'gambling', 'casino',
  'crypto scam', 'get rich quick', 'mlm',
];

const MIN_TITLE_LENGTH = 20;
const MIN_SNIPPET_LENGTH = 40;

export async function filterThreads(env: Env, threads: RedditThread[]): Promise<{
  passed: RedditThread[];
  filtered: number;
}> {
  const passed: RedditThread[] = [];
  let filtered = 0;

  for (const thread of threads) {
    const reason = await checkThread(env, thread);
    if (reason) {
      console.log(`[gates] Skipped ${thread.redditId}: ${reason}`);
      filtered++;
    } else {
      passed.push(thread);
    }
  }

  console.log(`[gates] ${passed.length} passed, ${filtered} filtered`);
  return { passed, filtered };
}

async function checkThread(env: Env, thread: RedditThread): Promise<string | null> {
  if (thread.title.length < MIN_TITLE_LENGTH) return 'title_too_short';
  if (thread.snippet.length < MIN_SNIPPET_LENGTH) return 'snippet_too_short';

  const lowerTitle = thread.title.toLowerCase();
  const lowerSnippet = thread.snippet.toLowerCase();
  const combined = `${lowerTitle} ${lowerSnippet}`;

  for (const term of BLOCKLIST) {
    if (combined.includes(term)) return `blocklist:${term}`;
  }

  if (lowerTitle.includes('[removed]') || lowerTitle.includes('[deleted]')) return 'removed';

  const existing = await getPostByRedditId(env.DB, thread.redditId);
  if (existing) return `already_processed:${existing.status}`;

  return null;
}

export async function deduplicateByTopic(
  env: Env, threads: RedditThread[], threshold = 0.85
): Promise<RedditThread[]> {
  if (!env.VECTORIZE) return threads;

  const deduplicated: RedditThread[] = [];

  for (const thread of threads) {
    try {
      const embedding = await generateEmbedding(env, `${thread.title} ${thread.snippet}`);
      const matches = await env.VECTORIZE.query(embedding, { topK: 3, returnMetadata: 'all' });

      const tooSimilar = matches.matches?.some(m => (m.score || 0) >= threshold);
      if (tooSimilar) {
        console.log(`[gates] Deduplicated ${thread.redditId}: too similar to existing post`);
        continue;
      }

      deduplicated.push(thread);
    } catch (err) {
      console.warn(`[gates] Vectorize error for ${thread.redditId}, passing through:`, (err as Error).message);
      deduplicated.push(thread);
    }
  }

  return deduplicated;
}

async function generateEmbedding(env: Env, text: string): Promise<number[]> {
  const result = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [text.slice(0, 512)],
  }) as { data: number[][] };
  return result.data[0];
}

export async function indexPublishedPost(env: Env, redditId: string, title: string, description: string): Promise<void> {
  if (!env.VECTORIZE) return;
  try {
    const embedding = await generateEmbedding(env, `${title} ${description}`);
    await env.VECTORIZE.upsert([{
      id: redditId,
      values: embedding,
      metadata: { title, redditId },
    }]);
  } catch (err) {
    console.warn('[gates] Failed to index post in Vectorize:', (err as Error).message);
  }
}
