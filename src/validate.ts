import type { GeneratedArticle } from './types';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateArticle(article: GeneratedArticle, redditUrl: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (article.wordCount < 800) {
    errors.push(`Word count too low: ${article.wordCount} (minimum 800)`);
  }
  if (article.wordCount > 5000) {
    warnings.push(`Word count high: ${article.wordCount} (target 1500-3000)`);
  }

  if (!article.html.includes('GTM-NR7F6P92')) {
    errors.push('Missing GTM tracking snippet');
  }

  if (!article.html.includes('application/ld+json')) {
    errors.push('Missing JSON-LD structured data');
  }

  if (!article.html.includes('BlogPosting')) {
    errors.push('Missing BlogPosting schema');
  }
  if (!article.html.includes('BreadcrumbList')) {
    errors.push('Missing BreadcrumbList schema');
  }
  if (!article.html.includes('QAPage')) {
    errors.push('Missing QAPage schema');
  }

  if (!article.html.includes(redditUrl)) {
    errors.push('Missing Reddit source URL in article body');
  }

  if (!article.html.includes('AI Disclosure')) {
    errors.push('Missing AI disclosure block');
  }

  const canonical = article.html.match(/rel="canonical"\s+href="([^"]+)"/);
  if (canonical && canonical[1].endsWith('.html')) {
    errors.push('Canonical URL should not end with .html');
  }

  if (!article.html.includes('og:image')) {
    errors.push('Missing og:image meta tag');
  }
  if (!article.html.includes('twitter:image')) {
    errors.push('Missing twitter:image meta tag');
  }

  if (!article.html.includes('John Williams')) {
    warnings.push('Missing author name in article');
  }

  if (!article.html.includes('site-search.js')) {
    warnings.push('Missing shared site-search.js script');
  }

  if (!article.slug || article.slug.length < 5) {
    errors.push(`Invalid slug: "${article.slug}"`);
  }

  if (!article.description || article.description.length < 30) {
    warnings.push('Meta description too short');
  }
  if (article.description && article.description.length > 160) {
    warnings.push(`Meta description too long: ${article.description.length} chars`);
  }

  try {
    const jsonLdBlocks = article.html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    if (jsonLdBlocks) {
      for (const block of jsonLdBlocks) {
        const json = block.replace(/<\/?script[^>]*>/g, '');
        JSON.parse(json);
      }
    }
  } catch {
    errors.push('JSON-LD structured data contains invalid JSON');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
