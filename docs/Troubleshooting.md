# Troubleshooting

## Known Bugs (Fixed)

### BUG: `initDb` crashes with "incomplete input: SQLITE_ERROR"

**Root cause**: D1's `db.exec()` fails when bundled TypeScript passes multi-statement SQL. The Wrangler bundler breaks the multi-line template literal, sending only the first line (`CREATE TABLE IF NOT EXISTS posts (`) to SQLite.

**Symptoms**: Pipeline returns `postsSeen: 0` instantly (~200ms), no entries in `run_log`, and the outer `try/catch` silently swallows the error.

**Fix**: Split the single `db.exec()` call into three separate `db.prepare().run()` calls — one per table. Each statement is self-contained and survives bundling.

```typescript
// BROKEN — db.exec() with multi-statement SQL
await db.exec(`CREATE TABLE IF NOT EXISTS posts (...); CREATE TABLE IF NOT EXISTS budget (...);`);

// FIXED — individual prepare().run() calls
await db.prepare(`CREATE TABLE IF NOT EXISTS posts (...)`).run();
await db.prepare(`CREATE TABLE IF NOT EXISTS budget (...)`).run();
await db.prepare(`CREATE TABLE IF NOT EXISTS run_log (...)`).run();
```

### BUG: SearchAPI key mismatch — "Invalid API key"

**Root cause**: The Cloudflare Pages project had a stale/wrong `SEARCHAPI_KEY` environment variable. When secrets were transferred from Pages to the blog-engine worker, the invalid key was copied.

**Symptoms**: `discoverThreads()` returns 0 threads even though the API test succeeds with a simple `?q=test` query. The SearchAPI returns `{"error": "Invalid API key."}` for the actual Reddit queries.

**Fix**: The working key was on the `buddy-agent` worker. Retrieved it via a temporary authenticated endpoint and set it on both the blog-engine worker and the Pages project using `wrangler secret put SEARCHAPI_KEY`.

**Prevention**: Always verify API keys after transfer by running a diagnostic:
```bash
curl "https://blog-engine.YOUR_SUBDOMAIN.workers.dev/status?key=YOUR_CRON_SECRET"
```

### BUG: Notifications using Resend (not configured)

**Root cause**: The original `notify.ts` used the Resend API for email and SMS. But the deployment environment uses Gmail API via Google OAuth for all email delivery — Resend was never set up.

**Fix**: Rewrote notifications to call `/api/blog-notify` on the Pages site, which uses the admin's existing Google OAuth connection to send email via Gmail API and SMS via AT&T's email-to-text gateway (`number@txt.att.net`). No new services required.

---

## Common Issues

### Posts returning 404 after publish

**Cause**: Cloudflare Pages hasn't deployed yet, or the deploy failed.

**Solution**: The engine's verification step retries 5 times over ~3 minutes. If all retries fail, the post is marked as `failed` and you get an error email. Check:

1. Your Cloudflare Pages dashboard for deploy status
2. The `run_log` table: `wrangler d1 execute blog-tracker --remote --command "SELECT * FROM run_log ORDER BY id DESC LIMIT 5"`
3. The `posts` table: `wrangler d1 execute blog-tracker --remote --command "SELECT reddit_id, slug, status, error_message FROM posts WHERE status = 'failed'"`

### SearchAPI returning empty results

**Cause**: Rate limit hit, invalid API key, or search queries not finding relevant threads.

**Solution**:
- Verify the key works: `curl "https://www.searchapi.io/api/v1/search?engine=google&q=test&api_key=YOUR_KEY&num=1"`
- Check your SearchAPI usage at [searchapi.io/dashboard](https://www.searchapi.io/)
- The engine handles 429s gracefully and moves on
- If consistently empty, add more search queries in `src/ingest.ts` `SEARCH_QUERIES` array

### Claude generation failing

**Cause**: API key invalid, rate limit, or model unavailable.

**Solution**:
- Verify your key: `curl https://api.anthropic.com/v1/messages -H "x-api-key: YOUR_KEY" -H "anthropic-version: 2023-06-01" -H "content-type: application/json" -d '{"model":"claude-sonnet-4-20250514","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'`
- The error is logged in the `posts` table `error_message` column

### Email/SMS not arriving

**Cause**: Gmail OAuth token expired or admin session missing from KV.

**Solution**:
- Test the notification endpoint directly:
```bash
curl -X POST "https://googleadsagent.ai/api/blog-notify" \
  -H "X-Cron-Secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type":"published","title":"Test Notification","url":"https://googleadsagent.ai/blog/test"}'
```
- If you get a token refresh error, re-authenticate via Buddy (this refreshes the admin OAuth session)
- For SMS, verify your carrier gateway:
  - AT&T: `number@txt.att.net`
  - T-Mobile: `number@tmomail.net`
  - Verizon: `number@vtext.com`

### Budget cap reached

**Cause**: Monthly spend exceeded `MAX_MONTHLY_USD`.

**Solution**: Check status: `curl "https://your-worker.workers.dev/status?key=YOUR_SECRET"`

Reset manually if needed:
```sql
wrangler d1 execute blog-tracker --remote --command "UPDATE budget SET total_cost_usd = 0 WHERE month = '2026-04'"
```

### Posts stuck in "generating" status

**Cause**: Worker crashed or timed out during generation.

**Solution**: The engine automatically resets stale "generating" posts (older than 2 hours) to "queued" on each run. You can also reset manually:

```sql
wrangler d1 execute blog-tracker --remote --command "UPDATE posts SET status = 'queued' WHERE status = 'generating'"
```

## Useful D1 Queries

```bash
# All published posts
wrangler d1 execute blog-tracker --remote --command "SELECT title, slug, published_at FROM posts WHERE status = 'published' ORDER BY published_at DESC"

# Failed posts with errors
wrangler d1 execute blog-tracker --remote --command "SELECT reddit_id, title, error_message FROM posts WHERE status = 'failed'"

# Monthly spend
wrangler d1 execute blog-tracker --remote --command "SELECT * FROM budget ORDER BY month DESC LIMIT 3"

# Recent runs
wrangler d1 execute blog-tracker --remote --command "SELECT run_id, trigger_type, posts_seen, posts_published, posts_failed, error FROM run_log ORDER BY id DESC LIMIT 10"

# Topic distribution
wrangler d1 execute blog-tracker --remote --command "SELECT topic_cluster, COUNT(*) as cnt FROM posts WHERE status = 'published' GROUP BY topic_cluster ORDER BY cnt DESC"
```
