import type { Env } from './types';

export async function notifyPublished(env: Env, title: string, url: string): Promise<void> {
  await callBlogNotify(env, { type: 'published', title, url });
}

export async function notifyError(env: Env, error: string): Promise<void> {
  await callBlogNotify(env, { type: 'error', title: 'Blog Engine Error', message: error });
}

export async function notifyBudgetAlert(
  env: Env,
  percentage: number,
  currentCost: number,
  limit: number,
): Promise<void> {
  const title = `Blog Engine Budget Alert: ${percentage}% used`;
  const message = `Monthly budget is at ${percentage}% ($${currentCost.toFixed(2)} of $${limit} limit).${
    percentage >= 100 ? ' Pipeline is PAUSED until next month.' : ' Approaching limit.'
  }`;
  await callBlogNotify(env, { type: 'budget', title, message });
}

async function callBlogNotify(env: Env, payload: Record<string, string>): Promise<void> {
  if (!env.SITE_URL || !env.CRON_SECRET) {
    console.warn('[notify] Missing SITE_URL or CRON_SECRET, skipping notification');
    return;
  }

  try {
    const resp = await fetch(`${env.SITE_URL}/api/blog-notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Cron-Secret': env.CRON_SECRET,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    if (resp.ok) {
      console.log(`[notify] ${payload.type} notification sent: ${payload.title}`);
    } else {
      const err = await resp.text().catch(() => '');
      console.error(`[notify] Failed (${resp.status}): ${err.substring(0, 200)}`);
    }
  } catch (e) {
    console.error(`[notify] Error: ${(e as Error).message}`);
  }
}

export async function callIndexNow(env: Env, urls: string[]): Promise<void> {
  if (!env.CRON_SECRET || urls.length === 0) return;

  try {
    const resp = await fetch(`${env.SITE_URL}/api/indexnow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls, engine: 'all' }),
      signal: AbortSignal.timeout(15000),
    });

    if (resp.ok) {
      console.log(`[notify] IndexNow: submitted ${urls.length} URLs`);
    } else {
      console.warn(`[notify] IndexNow failed: ${resp.status}`);
    }
  } catch (err) {
    console.warn('[notify] IndexNow error:', (err as Error).message);
  }
}
