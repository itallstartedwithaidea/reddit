# SEO Best Practices

This engine was designed after responding to Google's March 2026 core update and spam update. Every SEO decision is informed by real data from managing 2.8M programmatic pages.

## Structured Data

Every article includes three JSON-LD blocks:

### 1. BlogPosting

```json
{
  "@type": "BlogPosting",
  "headline": "Article title",
  "author": {
    "@type": "Person",
    "name": "John Williams",
    "jobTitle": "Senior Paid Media Specialist",
    "sameAs": ["github", "twitter", "substack"]
  },
  "datePublished": "2026-04-05",
  "dateModified": "2026-04-05",
  "publisher": { "@type": "Organization" },
  "mainEntityOfPage": "canonical URL",
  "keywords": ["relevant", "keywords"],
  "articleSection": "Topic Cluster Name"
}
```

### 2. QAPage

Targets Google's People Also Ask and featured snippets:

```json
{
  "@type": "QAPage",
  "mainEntity": {
    "@type": "Question",
    "name": "The Reddit question",
    "acceptedAnswer": {
      "@type": "Answer",
      "author": { "@type": "Person", "name": "John Williams" }
    }
  }
}
```

### 3. BreadcrumbList

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "name": "Home", "item": "https://yoursite.com/" },
    { "name": "Blog", "item": "https://yoursite.com/blog/" },
    { "name": "Community Q&A" },
    { "name": "Article Title" }
  ]
}
```

## E-E-A-T Signals

Google's Experience, Expertise, Authoritativeness, and Trustworthiness signals:

| Signal | Implementation |
|--------|---------------|
| **Experience** | Author bio references $48M+ managed spend |
| **Expertise** | Content includes specific benchmarks, CPC ranges, strategy frameworks |
| **Authority** | `sameAs` links to GitHub, Twitter, Substack; `Person` entity with `jobTitle` |
| **Trust** | AI disclosure visible on every page; Reddit source attribution; no fabricated quotes |

## URL Structure

- Canonical URLs use **no `.html` extension**: `/blog/reddit/your-slug`
- Cloudflare Pages serves `.html` files at extensionless URLs automatically
- Slugs are lowercase, hyphenated, max 80 characters

## IndexNow

After each publish, the engine calls the site's `/api/indexnow` endpoint which notifies:
- api.indexnow.org (Bing, DuckDuckGo)
- yandex.com
- search.naver.com
- search.seznam.cz

Posts typically appear in Bing within 1-4 hours. Google does not support IndexNow but discovers content via sitemap.

## Dynamic Sitemap

The engine includes a dynamic sitemap endpoint (`/api/blog-sitemap`) that:
- Lists all static blog URLs (articles, tutorials, guides)
- Includes all published Reddit Q&A posts from D1/KV
- Uses proper `lastmod`, `changefreq`, and `priority` values

Register it in your `sitemap.xml` index:
```xml
<sitemap>
  <loc>https://yoursite.com/api/blog-sitemap</loc>
</sitemap>
```

## Content Quality Rules (March 2026 Core Update Lessons)

1. **No templated filler**: Each article is 1,500-3,000 words of unique expert analysis
2. **QAPage not FAQPage**: Single authoritative Q&A per post (correct schema)
3. **Real benchmarks**: CPC ranges, conversion rates, ROAS targets from real campaigns
4. **Source transparency**: Reddit permalink + AI disclosure on every post
5. **Semantic dedup**: Vectorize prevents thin duplicate content (0.85 cosine threshold)
6. **Unique per page**: Every article answers a different question with different data
