import type { Env, RunStats, BlogManifestEntry } from './types';
import { initDb, insertPost, updatePostStatus, logRun, finishRun, resetStaleGenerating } from './db';
import { discoverThreads } from './ingest';
import { filterThreads, deduplicateByTopic, indexPublishedPost } from './gates';
import { generateArticle, findRelatedPosts } from './generate';
import { validateArticle } from './validate';
import { publishToGitHub, verifyPublished, updateManifest } from './publish';
import { notifyPublished, notifyError, callIndexNow } from './notify';
import { checkBudget, recordGeneration } from './budget';
import { classifyTopic } from './topics';

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runPipeline(env, 'cron'));
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return Response.json({ service: 'blog-engine', status: 'healthy', ts: new Date().toISOString() });
    }

    if (url.pathname === '/run' && request.method === 'POST') {
      const secret = request.headers.get('X-Cron-Secret') || url.searchParams.get('key');
      if (!env.CRON_SECRET || secret !== env.CRON_SECRET) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const dryRun = url.searchParams.get('dry_run') === 'true';
      if (dryRun) {
        const stats = await runPipeline(env, 'manual-dry', true);
        return Response.json({ dryRun: true, stats });
      }

      ctx.waitUntil(runPipeline(env, 'manual'));
      return Response.json({ accepted: true, message: 'Pipeline started' });
    }

    if (url.pathname === '/status') {
      const secret = request.headers.get('X-Cron-Secret') || url.searchParams.get('key');
      if (!env.CRON_SECRET || secret !== env.CRON_SECRET) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const budget = await checkBudget(env);
      return Response.json({ budget });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  },
};

async function runPipeline(env: Env, trigger: string, dryRun = false): Promise<RunStats> {
  const runId = `${trigger}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const stats: RunStats = {
    runId,
    postsSeen: 0,
    postsFiltered: 0,
    postsGenerated: 0,
    postsPublished: 0,
    postsFailed: 0,
    publishedPosts: [],
  };

  console.log(`[pipeline] Starting run ${runId} (trigger: ${trigger}, dryRun: ${dryRun})`);

  try {
    await initDb(env.DB);
    await resetStaleGenerating(env.DB);

    const budget = await checkBudget(env);
    if (!budget.allowed) {
      console.log(`[pipeline] Budget check failed: ${budget.reason}`);
      return stats;
    }

    const maxPerRun = parseInt(env.MAX_POSTS_PER_RUN || '2', 10);
    const remainingDaily = budget.dailyLimit - budget.dailyUsed;
    const publishLimit = Math.min(maxPerRun, remainingDaily);

    if (publishLimit <= 0) {
      console.log('[pipeline] No remaining publish slots for today');
      return stats;
    }

    await logRun(env.DB, runId, trigger);

    // 1. Discover
    const threads = await discoverThreads(env, 20);
    stats.postsSeen = threads.length;
    console.log(`[pipeline] Discovered ${threads.length} threads`);

    if (threads.length === 0) {
      await finishRun(env.DB, runId, { seen: 0, filtered: 0, generated: 0, published: 0, failed: 0 });
      return stats;
    }

    // 2. Filter
    const { passed, filtered } = await filterThreads(env, threads);
    stats.postsFiltered = filtered;

    // 3. Deduplicate by topic
    const deduplicated = await deduplicateByTopic(env, passed);
    stats.postsFiltered += passed.length - deduplicated.length;

    const candidates = deduplicated.slice(0, publishLimit);
    console.log(`[pipeline] ${candidates.length} candidates after filtering (limit: ${publishLimit})`);

    if (dryRun) {
      console.log('[pipeline] Dry run — skipping generation and publish');
      for (const c of candidates) {
        console.log(`  Would generate: "${c.title}" (r/${c.subreddit}, id: ${c.redditId})`);
      }
      await finishRun(env.DB, runId, {
        seen: stats.postsSeen, filtered: stats.postsFiltered,
        generated: 0, published: 0, failed: 0,
      });
      return stats;
    }

    // 4. Generate + validate + publish each
    const publishedUrls: string[] = [];

    for (const thread of candidates) {
      try {
        const cluster = classifyTopic(thread.title, thread.snippet);
        const slug = thread.title
          .toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

        await insertPost(env.DB, {
          reddit_id: thread.redditId,
          reddit_url: thread.url,
          subreddit: thread.subreddit,
          title: thread.title,
          slug,
          status: 'generating',
          topic_cluster: cluster,
        });

        // Generate
        const relatedPosts = await findRelatedPosts(env, thread.title, thread.snippet);
        const article = await generateArticle(env, thread, relatedPosts);
        stats.postsGenerated++;

        // Validate
        const validation = validateArticle(article, thread.url);
        if (!validation.valid) {
          console.error(`[pipeline] Validation failed for ${thread.redditId}:`, validation.errors);
          await updatePostStatus(env.DB, thread.redditId, 'failed', {
            error_message: validation.errors.join('; '),
          });
          stats.postsFailed++;
          continue;
        }
        if (validation.warnings.length > 0) {
          console.warn(`[pipeline] Validation warnings for ${thread.redditId}:`, validation.warnings);
        }

        await updatePostStatus(env.DB, thread.redditId, 'draft_ready', {
          word_count: article.wordCount,
          topic_cluster: article.topicCluster,
        });

        // Publish to GitHub
        const result = await publishToGitHub(env, article.slug, article.html);
        if (!result.success) {
          console.error(`[pipeline] GitHub publish failed for ${thread.redditId}:`, result.error);
          await updatePostStatus(env.DB, thread.redditId, 'failed', { error_message: result.error });
          stats.postsFailed++;
          continue;
        }

        // Wait for Cloudflare Pages deploy and verify the post is actually live
        console.log(`[pipeline] Waiting for deploy, then verifying ${article.slug}...`);
        const isLive = await verifyPublished(env.SITE_URL, article.slug);
        if (!isLive) {
          console.error(`[pipeline] Post committed but NOT live (404) for ${thread.redditId} — will NOT notify`);
          await updatePostStatus(env.DB, thread.redditId, 'failed', {
            error_message: 'Committed to git but failed deploy verification — post returned 404',
            published_url: result.url,
          });
          stats.postsFailed++;
          await notifyError(env, `Post "${article.title}" committed but 404 after deploy. Check Pages deploy status. Slug: ${article.slug}`);
          continue;
        }

        await recordGeneration(env, 0.08);

        await updatePostStatus(env.DB, thread.redditId, 'published', {
          published_url: result.url,
          published_at: new Date().toISOString(),
          generation_cost_usd: 0.08,
        });

        // Update manifest for dynamic blog index
        const manifestEntry: BlogManifestEntry = {
          title: article.title,
          slug: article.slug,
          description: article.description,
          url: result.url!,
          topicCluster: article.topicCluster,
          publishedAt: new Date().toISOString(),
          redditUrl: thread.url,
        };
        await updateManifest(env, manifestEntry);

        // Index in Vectorize for future dedup
        await indexPublishedPost(env, thread.redditId, article.title, article.description);

        stats.postsPublished++;
        stats.publishedPosts.push({ title: article.title, url: result.url! });
        publishedUrls.push(result.url!);

        // Notify
        await notifyPublished(env, article.title, result.url!);

        console.log(`[pipeline] Published: "${article.title}" -> ${result.url}`);
      } catch (err) {
        console.error(`[pipeline] Error processing ${thread.redditId}:`, (err as Error).message);
        await updatePostStatus(env.DB, thread.redditId, 'failed', {
          error_message: (err as Error).message,
        }).catch(() => {});
        stats.postsFailed++;
      }
    }

    // 5. IndexNow for all published
    if (publishedUrls.length > 0) {
      await callIndexNow(env, publishedUrls);
    }

    await finishRun(env.DB, runId, {
      seen: stats.postsSeen,
      filtered: stats.postsFiltered,
      generated: stats.postsGenerated,
      published: stats.postsPublished,
      failed: stats.postsFailed,
    });

    console.log(`[pipeline] Run ${runId} complete: ${stats.postsPublished} published, ${stats.postsFailed} failed`);
  } catch (err) {
    console.error(`[pipeline] Fatal error in run ${runId}:`, (err as Error).message);
    await notifyError(env, `Pipeline run ${runId} failed: ${(err as Error).message}`).catch(() => {});
    await finishRun(env.DB, runId, {
      seen: stats.postsSeen, filtered: stats.postsFiltered,
      generated: stats.postsGenerated, published: stats.postsPublished,
      failed: stats.postsFailed, error: (err as Error).message,
    }).catch(() => {});
  }

  return stats;
}
