import type { Env, RedditThread, GeneratedArticle, RelatedPost, TopicCluster } from './types';
import { renderArticle } from './template';
import { classifyTopic } from './topics';
import { getPublishedPosts } from './db';

export async function generateArticle(
  env: Env,
  thread: RedditThread,
  relatedPosts: RelatedPost[] = [],
): Promise<GeneratedArticle> {
  const topicCluster = classifyTopic(thread.title, thread.snippet);
  const slug = generateSlug(thread.title);
  const today = new Date().toISOString().slice(0, 10);

  const prompt = buildPrompt(thread, topicCluster);
  const { bodyHtml, description, keywords } = await callClaude(env, prompt);

  const wordCount = bodyHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

  const heroImageUrl = `https://googleadsagent.ai/og-image.png`;

  const html = renderArticle({
    title: thread.title,
    slug,
    description,
    datePublished: today,
    dateModified: today,
    keywords,
    topicCluster,
    redditUrl: thread.url,
    subreddit: thread.subreddit,
    heroImageUrl,
    bodyHtml,
    relatedPosts,
  });

  return { html, title: thread.title, slug, description, wordCount, topicCluster, relatedPosts };
}

function buildPrompt(thread: RedditThread, cluster: TopicCluster): string {
  return `You are John Williams, a Senior Paid Media Specialist with $350M+ in managed Google Ads spend. You write expert blog posts for googleadsagent.ai that answer real PPC practitioners' questions from Reddit.

CONTEXT:
- Reddit thread from r/${thread.subreddit}: "${thread.title}"
- Thread URL: ${thread.url}
- Community discussion snippet: "${thread.snippet}"
- Topic cluster: ${cluster}

TASK: Write a comprehensive, actionable blog post answering this question. Return ONLY valid HTML content (no full document, just the article body content that goes inside a <div class="article-wrap">).

REQUIREMENTS:
1. Start with a bold intro paragraph (use <p style="font-size:1.08rem;color:var(--text);font-weight:500;line-height:1.8;margin-bottom:2rem">) summarizing the practitioner's perspective
2. Use <h2> for major sections and <h3> for subsections
3. Include 4-6 major sections with actionable advice
4. Use <div class="callout"><strong>Key Insight:</strong> ...</div> for important takeaways (at least 2)
5. Use <div class="callout-green callout"><strong>Best Practice:</strong> ...</div> for recommended approaches
6. Use <div class="callout-red callout"><strong>Common Mistake:</strong> ...</div> for pitfalls
7. Include specific numbers, benchmarks, and ranges from real campaign experience where relevant
8. Reference the Reddit community discussion naturally: "A common question in the r/${thread.subreddit} community..." or "As practitioners often discuss..."
9. NEVER fabricate quotes from specific Redditors
10. NEVER include the article title as an H1 (the template handles that)
11. Word count: 1500-3000 words of substantive content
12. End with a "Bottom Line" or "What to Do Next" section with 3-5 concrete action items
13. Use <ul>/<ol> lists for step-by-step guidance
14. Use <table class="compare-table"> for comparisons when appropriate

Also return a JSON block at the very end with this exact format:
<!--META:{"description":"One-sentence SEO meta description under 155 chars","keywords":["keyword1","keyword2","keyword3"]}-->`;
}

async function callClaude(env: Env, prompt: string): Promise<{
  bodyHtml: string; description: string; keywords: string[];
}> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => 'unknown');
    throw new Error(`Claude API ${resp.status}: ${errText}`);
  }

  const data = await resp.json() as {
    content: Array<{ type: string; text: string }>;
    usage?: { input_tokens: number; output_tokens: number };
  };

  const text = data.content?.find(c => c.type === 'text')?.text || '';

  const metaMatch = text.match(/<!--META:(.*?)-->/s);
  let description = '';
  let keywords: string[] = [];

  if (metaMatch) {
    try {
      const meta = JSON.parse(metaMatch[1]);
      description = meta.description || '';
      keywords = meta.keywords || [];
    } catch { /* use defaults */ }
  }

  const bodyHtml = text.replace(/<!--META:.*?-->/s, '').trim();

  if (!description) {
    description = bodyHtml.replace(/<[^>]+>/g, ' ').slice(0, 150).trim() + '...';
  }

  return { bodyHtml, description, keywords };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function findRelatedPosts(env: Env, title: string, snippet: string, limit = 3): Promise<RelatedPost[]> {
  try {
    const published = await getPublishedPosts(env.DB, 50);
    if (published.length === 0) return [];

    if (!env.VECTORIZE) {
      return published.slice(0, limit).map(p => ({
        title: p.title,
        slug: p.slug,
        url: `https://googleadsagent.ai/blog/reddit/${p.slug}`,
      }));
    }

    const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [`${title} ${snippet}`.slice(0, 512)],
    }) as { data: number[][] };

    const matches = await env.VECTORIZE.query(embedding.data[0], {
      topK: limit,
      returnMetadata: 'all',
    });

    return (matches.matches || []).map(m => ({
      title: (m.metadata as Record<string, string>)?.title || 'Related Post',
      slug: m.id,
      url: `https://googleadsagent.ai/blog/reddit/${m.id}`,
    }));
  } catch {
    return [];
  }
}
