import type { RelatedPost, TopicCluster } from './types';
import { CLUSTER_LABELS } from './topics';

interface TemplateData {
  title: string;
  slug: string;
  description: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
  topicCluster: TopicCluster;
  redditUrl: string;
  subreddit: string;
  heroImageUrl: string;
  bodyHtml: string;
  relatedPosts: RelatedPost[];
}

export function renderArticle(data: TemplateData): string {
  const canonical = `https://googleadsagent.ai/blog/reddit/${data.slug}`;
  const clusterLabel = CLUSTER_LABELS[data.topicCluster] || 'Google Ads Strategy';

  const relatedHtml = data.relatedPosts.length > 0 ? `
<h2>Related Reading</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;margin:1.5rem 0">
${data.relatedPosts.map(p => `  <a href="${p.url}" style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:1.25rem;text-decoration:none;display:block;color:var(--text);transition:all .2s"><h3 style="font-size:.95rem;font-weight:600;margin-bottom:.4rem;color:var(--text)">${escapeHtml(p.title)}</h3><span style="font-size:.72rem;color:var(--text3);font-family:var(--font-mono)">Read more &rarr;</span></a>`).join('\n')}
</div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(data.title)} | googleadsagent.ai</title>
<meta name="description" content="${escapeAttr(data.description)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${escapeAttr(data.title)}">
<meta property="og:description" content="${escapeAttr(data.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="googleadsagent.ai">
<meta property="og:image" content="${data.heroImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta property="article:published_time" content="${data.datePublished}">
<meta property="article:modified_time" content="${data.dateModified}">
<meta property="article:author" content="https://googleadsagent.ai">
<meta property="article:section" content="${clusterLabel}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:creator" content="@_johnmwilliams">
<meta name="twitter:title" content="${escapeAttr(data.title)}">
<meta name="twitter:description" content="${escapeAttr(data.description)}">
<meta name="twitter:image" content="${data.heroImageUrl}">
<meta name="theme-color" content="#f0a830">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3CradialGradient id='g' cx='38%25' cy='38%25'%3E%3Cstop offset='0%25' stop-color='%23f0a830'/%3E%3Cstop offset='100%25' stop-color='%23b07518'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='16' cy='16' r='15' fill='url(%23g)'/%3E%3C/svg%3E">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": ${JSON.stringify(data.title)},
  "author": {
    "@type": "Person",
    "name": "John Williams",
    "url": "https://googleadsagent.ai",
    "jobTitle": "Senior Paid Media Specialist",
    "sameAs": [
      "https://github.com/itallstartedwithaidea",
      "https://twitter.com/_johnmwilliams",
      "https://itallstartedwithaidea.substack.com"
    ]
  },
  "datePublished": "${data.datePublished}",
  "dateModified": "${data.dateModified}",
  "publisher": {
    "@type": "Organization",
    "name": "googleadsagent.ai",
    "url": "https://googleadsagent.ai"
  },
  "mainEntityOfPage": "${canonical}",
  "description": ${JSON.stringify(data.description)},
  "keywords": ${JSON.stringify(data.keywords)},
  "articleSection": "${clusterLabel}"
}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://googleadsagent.ai/"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://googleadsagent.ai/blog/"},{"@type":"ListItem","position":3,"name":"Community Q&A","item":"https://googleadsagent.ai/blog/#community-qa"},{"@type":"ListItem","position":4,"name":${JSON.stringify(data.title)}}]}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "QAPage",
  "mainEntity": {
    "@type": "Question",
    "name": ${JSON.stringify(data.title)},
    "text": ${JSON.stringify(data.description)},
    "answerCount": 1,
    "dateCreated": "${data.datePublished}",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": ${JSON.stringify(data.description)},
      "dateCreated": "${data.datePublished}",
      "author": {
        "@type": "Person",
        "name": "John Williams",
        "url": "https://googleadsagent.ai"
      }
    }
  }
}
</script>
<style>
:root{--bg:#08080d;--bg2:#0e0e16;--bg3:#14141f;--surface:#1a1a2a;--border:#2a2a3a;--text:#e8e6e3;--text2:#9a9aaa;--text3:#6a6a7a;--amber:#f0a830;--amber-dim:rgba(240,168,48,0.12);--green:#4ade80;--blue:#60a5fa;--red:#f87171;--purple:#a78bfa;--font-mono:'JetBrains Mono','Courier New',monospace;--font-body:'IBM Plex Sans',-apple-system,sans-serif;--font-serif:'Playfair Display',Georgia,serif}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:var(--amber);text-decoration:none}a:hover{text-decoration:underline}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;height:52px;background:var(--bg2);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;backdrop-filter:blur(12px)}
.topbar-left{display:flex;align-items:center;gap:.75rem}
.topbar-logo{font-family:var(--font-mono);font-size:.8rem;color:var(--text2)}.topbar-logo span{color:var(--amber)}
.topbar-sep{color:var(--text3);font-size:.7rem}.topbar-title{font-weight:600;font-size:.9rem}
.topbar-right{display:flex;gap:.5rem;align-items:center}
.tb{background:var(--surface);border:1px solid var(--border);color:var(--text2);padding:.5rem 1rem;border-radius:6px;font-size:.78rem;cursor:pointer;font-family:var(--font-body);transition:all .2s;text-decoration:none}
.tb:hover{border-color:var(--amber);color:var(--amber);text-decoration:none}
.tb-menu{display:none;background:none;border:1px solid var(--border);color:var(--text2);padding:.35rem .6rem;border-radius:6px;font-size:1rem;cursor:pointer}.tb-menu:hover{border-color:var(--amber);color:var(--amber)}
.hero{padding:80px 20px 60px;background:linear-gradient(135deg, #1a0a2e 0%, #0a1a2e 100%);border-bottom:1px solid var(--border);text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 50% 0%,rgba(240,168,48,0.06) 0%,transparent 70%);pointer-events:none}
.hero-inner{max-width:800px;margin:0 auto;position:relative;z-index:1}
.hero h1{font-family:var(--font-serif);font-size:clamp(26px,5vw,48px);font-weight:800;color:var(--text);line-height:1.15;margin-bottom:16px}
.hero .author-line{color:var(--text2);font-size:.9rem;margin-bottom:8px;font-family:var(--font-mono)}
.hero .author-line strong{color:var(--amber)}
.hero .source-line{font-size:.78rem;color:var(--text3);font-family:var(--font-mono)}
.hero .source-line a{color:var(--text3)}
.hero .source-line a:hover{color:var(--amber)}
.article-wrap{max-width:760px;margin:0 auto;padding:3rem 1.5rem}
.article-wrap h2{font-family:var(--font-mono);font-size:1.35rem;color:var(--amber);margin:2.5rem 0 1rem;padding-bottom:.5rem;border-bottom:1px solid var(--border)}
.article-wrap h3{font-size:1.1rem;color:var(--text);margin:1.5rem 0 .75rem;font-weight:600}
.article-wrap p{margin-bottom:1.2rem;color:var(--text2);font-size:1rem}
.article-wrap ul,.article-wrap ol{margin:0 0 1.2rem 1.5rem;color:var(--text2)}
.article-wrap ul li,.article-wrap ol li{margin-bottom:.5rem;font-size:1rem}
.article-wrap a{color:var(--amber)}
.article-wrap img{max-width:100%;height:auto;border-radius:8px;margin:1.5rem 0;border:1px solid var(--border)}
.callout{background:rgba(240,168,48,0.06);border:1px solid rgba(240,168,48,0.2);border-left:4px solid var(--amber);border-radius:8px;padding:1rem 1.25rem;margin:1.5rem 0;font-size:.92rem;color:var(--text2)}
.callout strong{color:var(--amber)}
.callout-red{background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.2);border-left:4px solid var(--red)}
.callout-red strong{color:var(--red)}
.callout-green{background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.2);border-left:4px solid var(--green)}
.callout-green strong{color:var(--green)}
.stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin:2rem 0}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.25rem;text-align:center}
.stat-card .number{font-family:var(--font-mono);font-size:1.8rem;font-weight:700;color:var(--amber);display:block}
.stat-card .label{font-size:.82rem;color:var(--text3);margin-top:.25rem;display:block}
.compare-table{width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:.9rem}
.compare-table th{text-align:left;padding:.75rem;border-bottom:2px solid var(--border);color:var(--amber);font-family:var(--font-mono);font-size:.8rem}
.compare-table td{padding:.75rem;border-bottom:1px solid var(--border);color:var(--text2)}
.compare-table tr:hover td{background:rgba(240,168,48,0.03)}
.code-box{background:#0a0a12;border:1px solid var(--border);border-radius:8px;padding:1rem 1.25rem;margin:1rem 0;font-family:var(--font-mono);font-size:.82rem;color:var(--green);overflow-x:auto;line-height:1.8}
.ai-disclosure{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:1rem 1.25rem;margin:2.5rem 0;font-size:.85rem;color:var(--text3);line-height:1.6}
.ai-disclosure strong{color:var(--text2)}
.cluster-tag{display:inline-block;font-size:.72rem;color:var(--amber);font-family:var(--font-mono);background:var(--amber-dim);padding:3px 10px;border-radius:4px;margin-bottom:1rem}
.footer{text-align:center;padding:3rem 1.5rem;border-top:1px solid var(--border);margin-top:3rem;color:var(--text3);font-size:.82rem;max-width:760px;margin-left:auto;margin-right:auto}
.footer a{color:var(--amber)}
.footer-bio{margin-bottom:1rem;line-height:1.6}
@media(max-width:768px){
  .topbar-right .tb{display:none}.tb-menu{display:block}
  .topbar-right.menu-open{position:absolute;right:0;top:52px;background:var(--bg2);border:1px solid var(--border);border-radius:0 0 12px 12px;flex-direction:column;padding:12px;gap:6px;z-index:200;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
  .topbar-right.menu-open .tb{display:block;text-align:center}
  .hero{padding:50px 16px 40px}
  .hero h1{font-size:clamp(22px,6vw,36px)}
  .article-wrap{padding:2rem 1rem}
  .stat-row{grid-template-columns:1fr 1fr}
}
</style>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NR7F6P92');</script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NR7F6P92" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<div class="topbar">
  <div class="topbar-left">
    <a href="/" class="topbar-logo"><span>googleadsagent</span>.ai</a>
    <span class="topbar-sep">/</span>
    <a href="/blog/" class="topbar-title" style="color:var(--text);text-decoration:none">Blog</a>
  </div>
  <div class="topbar-right" id="topbarRight">
    <a href="/" class="tb">Home</a>
    <a href="/blog/" class="tb">Blog</a>
    <a href="/contact/" class="tb">Contact</a>
    <a href="/tools/auditor/app.html" class="tb">Buddy</a>
    <a href="/tools/google-ads-builder/app.html" class="tb">Ads Builder</a>
    <a href="/tools/audit-engine/app.html" class="tb">Audit Engine</a>
    <button class="tb-menu" onclick="document.getElementById('topbarRight').classList.toggle('menu-open')" aria-label="Menu">&#9776;</button>
  </div>
</div>

<div class="hero">
  <div class="hero-inner">
    <h1>${escapeHtml(data.title)}</h1>
    <div class="author-line"><strong>John Williams</strong> &middot; Senior Paid Media Specialist &middot; $350M+ Managed &middot; ${formatDate(data.datePublished)}</div>
    <div class="source-line">Based on an <a href="${escapeAttr(data.redditUrl)}" target="_blank" rel="noopener">r/${escapeHtml(data.subreddit)} community discussion</a></div>
  </div>
</div>

<div class="article-wrap">

<span class="cluster-tag">${clusterLabel}</span>

${data.bodyHtml}

${relatedHtml}

<div class="ai-disclosure">
  <strong>AI Disclosure:</strong> This article was generated with AI assistance based on a community discussion on <a href="${escapeAttr(data.redditUrl)}" target="_blank" rel="noopener">Reddit r/${escapeHtml(data.subreddit)}</a>. Expert analysis and practitioner perspective by John Williams, Senior Paid Media Specialist with $350M+ in managed Google Ads spend. AI was used to draft and structure the content; all strategic recommendations reflect real campaign experience.
</div>

</div>

<div class="footer">
  <div class="footer-bio">
    <strong><a href="/">John Williams</a></strong> &middot; Senior Paid Media Specialist &middot; $350M+ Managed<br>
    <a href="https://googleadsagent.ai">googleadsagent.ai</a> &middot; <a href="/contact/">Contact</a> &middot; <a href="https://github.com/itallstartedwithaidea" target="_blank" rel="noopener">GitHub</a> &middot; <a href="/blog/">Blog</a>
  </div>
  <div>&copy; <script>document.write(new Date().getFullYear())</script> googleadsagent.ai &mdash; All rights reserved.</div>
</div>

<script src="/shared/site-search.js" defer></script>
<script src="/shared/cookie-consent.js" defer></script>
<script src="/shared/chat-widget.js" defer></script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
