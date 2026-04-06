# Architecture Deep Dive

## Pipeline Flow

The blog engine is a single Cloudflare Worker that runs a sequential pipeline on each cron trigger:

```
┌─────────────┐
│ 1. DISCOVER  │ SearchAPI SERP queries for Reddit PPC threads
└──────┬──────┘
       ▼
┌─────────────┐
│ 2. FILTER    │ Blocklist, min engagement, removed/deleted check
└──────┬──────┘
       ▼
┌─────────────┐
│ 3. DEDUPE    │ D1 unique constraint + Vectorize cosine similarity
└──────┬──────┘
       ▼
┌─────────────┐
│ 4. CLASSIFY  │ 12-cluster topic classification by keyword matching
└──────┬──────┘
       ▼
┌─────────────┐
│ 5. GENERATE  │ Claude API → full HTML article (1,500-3,000 words)
└──────┬──────┘
       ▼
┌─────────────┐
│ 6. VALIDATE  │ 10+ checks (JSON-LD, GTM, links, disclosure, etc.)
└──────┬──────┘
       ▼
┌─────────────┐
│ 7. PUBLISH   │ GitHub API commit → Cloudflare Pages auto-deploy
└──────┬──────┘
       ▼
┌─────────────┐
│ 8. VERIFY    │ GET live URL, 5 retries, confirm 200 + content
└──────┬──────┘
       ▼
┌─────────────┐
│ 9. NOTIFY    │ Email (Resend) + SMS (AT&T gateway) + IndexNow
└─────────────┘
```

## Module Responsibilities

### `index.ts` — Pipeline Orchestrator

- Handles `scheduled()` (cron) and `fetch()` (HTTP) events
- Runs the full pipeline in sequence
- Manages the run log (start/finish/stats)
- Catches fatal errors and sends error notifications

### `ingest.ts` — Thread Discovery

- Builds SearchAPI queries: `site:reddit.com/r/PPC "google ads"` etc.
- Picks 3 random queries from a pool of 10 per run (variety)
- Deduplicates by Reddit post ID before returning
- Handles 429 rate limits gracefully

### `gates.ts` — Quality Filters

Two layers of filtering:

1. **Rule-based**: Title/snippet length, blocklist, removed/deleted detection, D1 existence check
2. **Semantic**: Vectorize cosine similarity against all published posts (threshold: 0.85)

### `topics.ts` — Classification

Keyword-based scoring across 12 PPC clusters. Each cluster has 10-15 keywords. The cluster with the highest keyword match count wins.

### `generate.ts` — Article Generation

- Builds a detailed prompt with thread context, topic cluster, and formatting rules
- Calls Claude (claude-sonnet-4-20250514) with 8,000 max tokens
- Parses the response for body HTML and a `<!--META:...-->` JSON block
- Finds related posts via Vectorize similarity

### `template.ts` — HTML Rendering

- Receives article data and renders a complete HTML document
- Matches the exact CSS, fonts, and layout of googleadsagent.ai
- Includes 3 JSON-LD blocks, full meta tags, GTM, and shared scripts

### `validate.ts` — Quality Gate

- Parses JSON-LD blocks to confirm valid JSON
- Checks for required elements (GTM, disclosure, Reddit link, etc.)
- Returns errors (block publish) and warnings (log only)

### `publish.ts` — GitHub + Deploy Verification

- Uses GitHub Contents API to create/update files
- Waits for Cloudflare Pages deploy
- Retries 5 times with increasing delays
- Uses GET (not HEAD) with `Cache-Control: no-cache` to bypass CDN cache

### `notify.ts` — Notifications + IndexNow

- Sends email via Resend API
- Sends SMS via Resend to `{number}@txt.att.net` (carrier email-to-SMS gateway)
- Calls the site's `/api/indexnow` endpoint for search engine notification

### `budget.ts` — Cost Management

- Checks daily generation count and monthly USD spend before each run
- Sends alerts at 80% monthly budget
- Pauses pipeline at 100%

## Data Model

### posts table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Auto-increment primary key |
| reddit_id | TEXT (UNIQUE) | Reddit post ID — prevents duplicates |
| reddit_url | TEXT | Full Reddit permalink |
| subreddit | TEXT | Source subreddit (PPC, googleads, etc.) |
| title | TEXT | Thread title (used as article title) |
| slug | TEXT (UNIQUE) | URL slug for the published post |
| status | TEXT | Pipeline state (queued/generating/published/failed/skipped) |
| topic_cluster | TEXT | Classified PPC topic |
| word_count | INTEGER | Article word count |
| published_url | TEXT | Live URL after publish |
| generation_cost_usd | REAL | Estimated Claude API cost |
| published_at | TEXT | ISO timestamp of publish |

### budget table

| Column | Type | Description |
|--------|------|-------------|
| month | TEXT (UNIQUE) | YYYY-MM format |
| posts_generated | INTEGER | Count for the month |
| total_cost_usd | REAL | Running total |

### run_log table

| Column | Type | Description |
|--------|------|-------------|
| run_id | TEXT | Unique run identifier |
| trigger_type | TEXT | cron / manual / manual-dry |
| posts_seen | INTEGER | Threads discovered |
| posts_filtered | INTEGER | Threads filtered out |
| posts_published | INTEGER | Successfully published |
| posts_failed | INTEGER | Failed generation or publish |
