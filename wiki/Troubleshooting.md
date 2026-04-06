# Troubleshooting

## Common Issues

### Posts returning 404 after publish

**Cause**: Cloudflare Pages hasn't deployed yet, or the deploy failed.

**Solution**: The engine's verification step retries 5 times over ~3 minutes. If all retries fail, the post is marked as `failed` and you get an error email. Check:

1. Your Cloudflare Pages dashboard for deploy status
2. The `run_log` table: `wrangler d1 execute blog-tracker --command "SELECT * FROM run_log ORDER BY id DESC LIMIT 5"`
3. The `posts` table: `wrangler d1 execute blog-tracker --command "SELECT reddit_id, slug, status, error_message FROM posts WHERE status = 'failed'"`

### SearchAPI returning empty results

**Cause**: Rate limit hit, or search queries not finding relevant threads.

**Solution**:
- Check your SearchAPI usage at [searchapi.io/dashboard](https://www.searchapi.io/)
- The engine handles 429s gracefully and moves on
- If consistently empty, add more search queries in `src/ingest.ts` `SEARCH_QUERIES` array

### Claude generation failing

**Cause**: API key invalid, rate limit, or model unavailable.

**Solution**:
- Verify your key: `curl https://api.anthropic.com/v1/messages -H "x-api-key: YOUR_KEY" -H "anthropic-version: 2023-06-01" -H "content-type: application/json" -d '{"model":"claude-sonnet-4-20250514","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'`
- The error is logged in the `posts` table `error_message` column

### Email/SMS not arriving

**Cause**: Resend API key invalid, or carrier gateway blocking.

**Solution**:
- Test Resend directly: `curl -X POST https://api.resend.com/emails -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" -d '{"from":"test@yoursite.com","to":"your@email.com","subject":"test","text":"test"}'`
- For SMS, verify your carrier gateway:
  - AT&T: `number@txt.att.net`
  - T-Mobile: `number@tmomail.net`
  - Verizon: `number@vtext.com`

### Budget cap reached

**Cause**: Monthly spend exceeded `MAX_MONTHLY_USD`.

**Solution**: Check status: `curl "https://your-worker.workers.dev/status?key=YOUR_SECRET"`

Reset manually if needed:
```sql
wrangler d1 execute blog-tracker --command "UPDATE budget SET total_cost_usd = 0 WHERE month = '2026-04'"
```

### Posts stuck in "generating" status

**Cause**: Worker crashed or timed out during generation.

**Solution**: The engine automatically resets stale "generating" posts (older than 2 hours) to "queued" on each run. You can also reset manually:

```sql
wrangler d1 execute blog-tracker --command "UPDATE posts SET status = 'queued' WHERE status = 'generating'"
```

## Useful D1 Queries

```bash
# All published posts
wrangler d1 execute blog-tracker --command "SELECT title, slug, published_at FROM posts WHERE status = 'published' ORDER BY published_at DESC"

# Failed posts with errors
wrangler d1 execute blog-tracker --command "SELECT reddit_id, title, error_message FROM posts WHERE status = 'failed'"

# Monthly spend
wrangler d1 execute blog-tracker --command "SELECT * FROM budget ORDER BY month DESC LIMIT 3"

# Recent runs
wrangler d1 execute blog-tracker --command "SELECT run_id, trigger_type, posts_seen, posts_published, posts_failed, error FROM run_log ORDER BY id DESC LIMIT 10"

# Topic distribution
wrangler d1 execute blog-tracker --command "SELECT topic_cluster, COUNT(*) as cnt FROM posts WHERE status = 'published' GROUP BY topic_cluster ORDER BY cnt DESC"
```
