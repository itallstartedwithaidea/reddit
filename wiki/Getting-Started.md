# Getting Started

This guide walks you through setting up the Reddit PPC Blog Engine from scratch.

## Prerequisites

| Requirement | Purpose | Where to Get It |
|-------------|---------|-----------------|
| Node.js 20+ | Runtime | [nodejs.org](https://nodejs.org/) |
| Wrangler CLI | Cloudflare deployment | `npm install -g wrangler` |
| Cloudflare account | Workers, D1, KV, R2, Vectorize | [cloudflare.com](https://cloudflare.com) |
| Anthropic API key | Claude article generation | [console.anthropic.com](https://console.anthropic.com/) |
| SearchAPI key | Reddit thread discovery | [searchapi.io](https://www.searchapi.io/) |
| GitHub PAT | Git commit from Worker | [github.com/settings/tokens](https://github.com/settings/tokens) |
| Resend API key | Email + SMS notifications | [resend.com](https://resend.com/) |

> **Cost note**: The Workers paid plan ($5/month) is required for cron triggers and D1. Claude costs ~$0.05-0.10 per article. SearchAPI has a free tier of 100 queries/month. Total monthly cost for 4 posts/day: ~$15-25.

## Step 1: Clone and Install

```bash
git clone https://github.com/itallstartedwithaidea/reddit.git
cd reddit
npm install
```

## Step 2: Authenticate Wrangler

```bash
wrangler login
```

This opens a browser window. Log in to your Cloudflare account and authorize Wrangler.

## Step 3: Create Cloudflare Resources

### D1 Database

```bash
wrangler d1 create blog-tracker
```

Output:
```
Created D1 database blog-tracker
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` and paste it into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-tracker"
database_id = "PASTE_YOUR_ID_HERE"
```

### KV Namespace

```bash
wrangler kv namespace create BLOG_DATA
```

Copy the `id` into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "BLOG_DATA"
id = "PASTE_YOUR_ID_HERE"
```

### R2 Bucket

```bash
wrangler r2 bucket create blog-assets
```

### Vectorize Index

```bash
wrangler vectorize create blog-topics --dimensions=768 --metric=cosine
```

## Step 4: Initialize the Database

```bash
wrangler d1 execute blog-tracker --file=./schema.sql
```

This creates three tables:
- `posts` — Tracks every Reddit thread through the pipeline
- `budget` — Monthly cost tracking
- `run_log` — Audit trail of every pipeline run

## Step 5: Set Secrets

```bash
# Claude API key for article generation
wrangler secret put ANTHROPIC_API_KEY

# SearchAPI key for Reddit discovery
wrangler secret put SEARCHAPI_KEY

# GitHub token for committing blog posts
wrangler secret put GITHUB_TOKEN

# Resend API key for email/SMS
wrangler secret put RESEND_API_KEY

# Your email address for notifications
wrangler secret put EMAIL_TO

# Your phone number for SMS (10 digits, no dashes)
wrangler secret put SMS_GATEWAY_TO

# Random secret for auth (used by cron scheduler)
wrangler secret put CRON_SECRET
```

## Step 6: Update Site Config

In `wrangler.toml`, set your site details:

```toml
[vars]
SITE_URL = "https://yoursite.com"
GITHUB_REPO = "yourusername/your-site-repo"
GITHUB_BRANCH = "main"
```

## Step 7: Deploy

```bash
wrangler deploy
```

## Step 8: Test

### Dry Run (no generation, no publish)

```bash
curl -X POST "https://blog-engine.YOUR_SUBDOMAIN.workers.dev/run?key=YOUR_CRON_SECRET&dry_run=true"
```

### Health Check

```bash
curl "https://blog-engine.YOUR_SUBDOMAIN.workers.dev/health"
```

### Budget Status

```bash
curl "https://blog-engine.YOUR_SUBDOMAIN.workers.dev/status?key=YOUR_CRON_SECRET"
```

### Full Run

```bash
curl -X POST "https://blog-engine.YOUR_SUBDOMAIN.workers.dev/run?key=YOUR_CRON_SECRET"
```

## What Happens Next

The cron triggers fire automatically:
- **7:00 AM ET** (11:00 UTC) — morning run
- **7:00 PM ET** (23:00 UTC) — evening run

Each run discovers 1-2 new Reddit PPC threads, generates expert articles, publishes them, and notifies you via email + text.
