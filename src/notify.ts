import type { Env } from './types';

export async function notifyPublished(env: Env, title: string, url: string): Promise<void> {
  await Promise.allSettled([
    sendEmail(env, title, url),
    sendSms(env, title, url),
  ]);
}

export async function notifyError(env: Env, error: string): Promise<void> {
  await sendEmail(env, 'Blog Engine Error', error, true).catch(err =>
    console.error('[notify] Failed to send error email:', (err as Error).message)
  );
}

export async function notifyBudgetAlert(env: Env, percentage: number, currentCost: number, limit: number): Promise<void> {
  const subject = `Blog Engine Budget Alert: ${percentage}% used`;
  const body = `Monthly budget is at ${percentage}% ($${currentCost.toFixed(2)} of $${limit} limit).${
    percentage >= 100 ? ' Pipeline is PAUSED until next month.' : ' Approaching limit.'
  }`;

  await Promise.allSettled([
    sendEmail(env, subject, body, true),
    sendSms(env, subject, ''),
  ]);
}

async function sendEmail(env: Env, title: string, content: string, isAlert = false): Promise<void> {
  if (!env.RESEND_API_KEY || !env.EMAIL_TO) {
    console.warn('[notify] Missing RESEND_API_KEY or EMAIL_TO, skipping email');
    return;
  }

  const subject = isAlert ? title : `New post live: ${title}`;
  const body = isAlert ? content : `${title}\n\n${content}\n\n— Blog Engine`;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Blog Engine <blog-engine@googleadsagent.ai>',
      to: env.EMAIL_TO,
      subject,
      text: body,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!resp.ok) {
    console.error(`[notify] Resend email failed: ${resp.status}`);
  } else {
    console.log(`[notify] Email sent to ${env.EMAIL_TO}: ${subject}`);
  }
}

async function sendSms(env: Env, title: string, url: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.SMS_GATEWAY_TO) {
    console.warn('[notify] Missing SMS_GATEWAY_TO, skipping text');
    return;
  }

  const smsAddress = `${env.SMS_GATEWAY_TO}@txt.att.net`;
  const body = url ? `New post: ${title} ${url}` : title;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Blog Engine <blog-engine@googleadsagent.ai>',
      to: smsAddress,
      subject: '',
      text: body,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!resp.ok) {
    console.error(`[notify] SMS gateway failed: ${resp.status}`);
  } else {
    console.log(`[notify] SMS sent via ${smsAddress}`);
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
