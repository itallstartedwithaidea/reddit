import type { Env, BlogManifestEntry } from './types';

export async function publishToGitHub(
  env: Env, slug: string, html: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const path = `blog/reddit/${slug}.html`;
  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`;

  try {
    const existing = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'blog-engine/1.0',
      },
      signal: AbortSignal.timeout(15000),
    });

    let sha: string | undefined;
    if (existing.ok) {
      const data = await existing.json() as { sha: string };
      sha = data.sha;
      console.log(`[publish] File exists at ${path}, will update (sha: ${sha.slice(0, 8)})`);
    }

    const body: Record<string, string> = {
      message: `blog-engine: publish "${slug}" [reddit]`,
      content: btoa(unescape(encodeURIComponent(html))),
      branch: env.GITHUB_BRANCH,
    };
    if (sha) body.sha = sha;

    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'blog-engine/1.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => 'unknown');
      return { success: false, error: `GitHub API ${resp.status}: ${errText}` };
    }

    const publishedUrl = `${env.SITE_URL}/blog/reddit/${slug}`;
    console.log(`[publish] Committed ${path} to ${env.GITHUB_BRANCH}`);

    return { success: true, url: publishedUrl };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function verifyPublished(siteUrl: string, slug: string, maxRetries = 5): Promise<boolean> {
  const urls = [
    `${siteUrl}/blog/reddit/${slug}`,
    `${siteUrl}/blog/reddit/${slug}.html`,
  ];

  for (let i = 0; i < maxRetries; i++) {
    if (i > 0) await sleep(15000 + (i * 10000));
    for (const url of urls) {
      try {
        const resp = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          signal: AbortSignal.timeout(15000),
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (resp.ok) {
          const body = await resp.text();
          if (body.includes('googleadsagent') && body.length > 1000) {
            console.log(`[publish] Verified live at ${url} (${body.length} bytes)`);
            return true;
          }
        }
        console.log(`[publish] Verify attempt ${i + 1}: HTTP ${resp.status} for ${url}`);
      } catch (err) {
        console.log(`[publish] Verify attempt ${i + 1} failed:`, (err as Error).message);
      }
    }
  }
  console.error(`[publish] FAILED to verify after ${maxRetries} attempts for slug: ${slug}`);
  return false;
}

export async function updateManifest(env: Env, entry: BlogManifestEntry): Promise<void> {
  const key = 'blog:manifest';
  const existing = await env.BLOG_DATA.get(key, 'json') as BlogManifestEntry[] | null;
  const manifest = existing || [];

  const idx = manifest.findIndex(e => e.slug === entry.slug);
  if (idx >= 0) {
    manifest[idx] = entry;
  } else {
    manifest.unshift(entry);
  }

  await env.BLOG_DATA.put(key, JSON.stringify(manifest));
  console.log(`[publish] Updated KV manifest: ${manifest.length} total posts`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
