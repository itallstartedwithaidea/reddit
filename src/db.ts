import type { PostRecord, PostStatus } from './types';

export async function initDb(db: D1Database): Promise<void> {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, reddit_id TEXT UNIQUE NOT NULL,
    reddit_url TEXT NOT NULL, subreddit TEXT NOT NULL, title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, status TEXT NOT NULL DEFAULT 'queued',
    skip_reason TEXT, topic_cluster TEXT, word_count INTEGER,
    hero_image_key TEXT, published_url TEXT, error_message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    published_at TEXT, generation_cost_usd REAL DEFAULT 0)`,
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS budget (
    id INTEGER PRIMARY KEY AUTOINCREMENT, month TEXT NOT NULL,
    posts_generated INTEGER NOT NULL DEFAULT 0,
    total_cost_usd REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(month))`,
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS run_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT, run_id TEXT NOT NULL,
    started_at TEXT NOT NULL DEFAULT (datetime('now')), finished_at TEXT,
    posts_seen INTEGER DEFAULT 0, posts_filtered INTEGER DEFAULT 0,
    posts_generated INTEGER DEFAULT 0, posts_published INTEGER DEFAULT 0,
    posts_failed INTEGER DEFAULT 0, error TEXT,
    trigger_type TEXT NOT NULL DEFAULT 'cron')`,
    )
    .run();
}

export async function getPostByRedditId(db: D1Database, redditId: string): Promise<PostRecord | null> {
  return db.prepare('SELECT * FROM posts WHERE reddit_id = ?').bind(redditId).first<PostRecord>();
}

export async function getPostBySlug(db: D1Database, slug: string): Promise<PostRecord | null> {
  return db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first<PostRecord>();
}

export async function insertPost(
  db: D1Database,
  post: Omit<PostRecord, 'id' | 'created_at' | 'updated_at'>,
): Promise<void> {
  await db
    .prepare(
      `
    INSERT INTO posts (reddit_id, reddit_url, subreddit, title, slug, status, skip_reason, topic_cluster)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    )
    .bind(
      post.reddit_id,
      post.reddit_url,
      post.subreddit,
      post.title,
      post.slug,
      post.status,
      post.skip_reason || null,
      post.topic_cluster || null,
    )
    .run();
}

export async function updatePostStatus(
  db: D1Database,
  redditId: string,
  status: PostStatus,
  extra: Partial<PostRecord> = {},
): Promise<void> {
  const sets = [`status = ?`, `updated_at = datetime('now')`];
  const vals: unknown[] = [status];

  if (extra.word_count !== undefined) {
    sets.push('word_count = ?');
    vals.push(extra.word_count);
  }
  if (extra.hero_image_key !== undefined) {
    sets.push('hero_image_key = ?');
    vals.push(extra.hero_image_key);
  }
  if (extra.published_url !== undefined) {
    sets.push('published_url = ?');
    vals.push(extra.published_url);
  }
  if (extra.error_message !== undefined) {
    sets.push('error_message = ?');
    vals.push(extra.error_message);
  }
  if (extra.published_at !== undefined) {
    sets.push('published_at = ?');
    vals.push(extra.published_at);
  }
  if (extra.generation_cost_usd !== undefined) {
    sets.push('generation_cost_usd = ?');
    vals.push(extra.generation_cost_usd);
  }
  if (extra.topic_cluster !== undefined) {
    sets.push('topic_cluster = ?');
    vals.push(extra.topic_cluster);
  }

  vals.push(redditId);
  await db
    .prepare(`UPDATE posts SET ${sets.join(', ')} WHERE reddit_id = ?`)
    .bind(...vals)
    .run();
}

export async function getPublishedPosts(db: D1Database, limit = 100): Promise<PostRecord[]> {
  const { results } = await db
    .prepare('SELECT * FROM posts WHERE status = ? ORDER BY published_at DESC LIMIT ?')
    .bind('published', limit)
    .all<PostRecord>();
  return results || [];
}

export async function getTodayGenerationCount(db: D1Database): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const row = await db
    .prepare(
      `SELECT COUNT(*) as cnt FROM posts WHERE status IN ('generating','draft_ready','published') AND created_at >= ?`,
    )
    .bind(today)
    .first<{ cnt: number }>();
  return row?.cnt || 0;
}

export async function getMonthlyBudget(db: D1Database): Promise<{ postsGenerated: number; totalCost: number }> {
  const month = new Date().toISOString().slice(0, 7);
  const row = await db.prepare('SELECT * FROM budget WHERE month = ?').bind(month).first<{
    posts_generated: number;
    total_cost_usd: number;
  }>();
  return { postsGenerated: row?.posts_generated || 0, totalCost: row?.total_cost_usd || 0 };
}

export async function incrementBudget(db: D1Database, costUsd: number): Promise<void> {
  const month = new Date().toISOString().slice(0, 7);
  await db
    .prepare(
      `
    INSERT INTO budget (month, posts_generated, total_cost_usd)
    VALUES (?, 1, ?)
    ON CONFLICT(month) DO UPDATE SET
      posts_generated = posts_generated + 1,
      total_cost_usd = total_cost_usd + ?,
      updated_at = datetime('now')
  `,
    )
    .bind(month, costUsd, costUsd)
    .run();
}

export async function logRun(db: D1Database, runId: string, trigger: string): Promise<void> {
  await db.prepare('INSERT INTO run_log (run_id, trigger_type) VALUES (?, ?)').bind(runId, trigger).run();
}

export async function finishRun(
  db: D1Database,
  runId: string,
  stats: { seen: number; filtered: number; generated: number; published: number; failed: number; error?: string },
): Promise<void> {
  await db
    .prepare(
      `
    UPDATE run_log SET finished_at = datetime('now'),
      posts_seen = ?, posts_filtered = ?, posts_generated = ?,
      posts_published = ?, posts_failed = ?, error = ?
    WHERE run_id = ?
  `,
    )
    .bind(stats.seen, stats.filtered, stats.generated, stats.published, stats.failed, stats.error || null, runId)
    .run();
}

export async function resetStaleGenerating(db: D1Database, maxAgeHours = 2): Promise<number> {
  const { meta } = await db
    .prepare(
      `
    UPDATE posts SET status = 'queued', updated_at = datetime('now')
    WHERE status = 'generating'
    AND updated_at < datetime('now', ? || ' hours')
  `,
    )
    .bind(-maxAgeHours)
    .run();
  return meta?.changes || 0;
}
