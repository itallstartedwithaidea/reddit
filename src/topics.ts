import type { TopicCluster } from './types';

const TOPIC_KEYWORDS: Record<TopicCluster, string[]> = {
  bidding: [
    'bid', 'bidding', 'tcpa', 'troas', 'target cpa', 'target roas', 'smart bidding',
    'manual cpc', 'ecpc', 'maximize conversions', 'maximize clicks', 'bid strategy',
    'bid adjustment', 'portfolio bid',
  ],
  creative: [
    'rsa', 'responsive search', 'headline', 'description', 'ad copy', 'ad text',
    'creative', 'ad strength', 'pinning', 'asset', 'extension', 'sitelink',
    'callout', 'image extension',
  ],
  audiences: [
    'audience', 'targeting', 'remarketing', 'retargeting', 'custom segment',
    'in-market', 'affinity', 'similar audience', 'customer match', 'lookalike',
    'demographic', 'observation', 'broad match',
  ],
  measurement: [
    'conversion', 'tracking', 'ga4', 'analytics', 'attribution', 'gtag',
    'conversion action', 'offline conversion', 'enhanced conversion', 'consent mode',
    'server-side', 'data-driven',
  ],
  automation: [
    'script', 'automation', 'rule', 'automated', 'ai max', 'auto-apply',
    'recommendation', 'optimization score', 'mcc', 'bulk', 'api',
  ],
  policy: [
    'disapproved', 'policy', 'suspended', 'banned', 'trademark', 'review',
    'appeal', 'circumvent', 'violation', 'restricted', 'limited by policy',
  ],
  shopping: [
    'shopping', 'merchant center', 'product feed', 'pmax', 'performance max',
    'product listing', 'free listing', 'google merchant', 'product group',
    'supplemental feed',
  ],
  video: [
    'youtube', 'video', 'demand gen', 'discovery', 'bumper', 'trueview',
    'video action', 'video campaign', 'skippable', 'shorts',
  ],
  local: [
    'local', 'google business', 'gmb', 'local campaign', 'local service',
    'location extension', 'call ad', 'store visit', 'map',
  ],
  budget: [
    'budget', 'spend', 'cost', 'cpc', 'cpm', 'cpa', 'roas', 'roi',
    'overspend', 'daily budget', 'shared budget', 'pacing', 'waste',
    'how much', 'affordable',
  ],
  'account-structure': [
    'account structure', 'campaign structure', 'ad group', 'organize',
    'naming convention', 'single keyword', 'skag', 'hagakure', 'consolidate',
  ],
  general: [],
};

export function classifyTopic(title: string, snippet: string): TopicCluster {
  const text = `${title} ${snippet}`.toLowerCase();
  let bestCluster: TopicCluster = 'general';
  let bestScore = 0;

  for (const [cluster, keywords] of Object.entries(TOPIC_KEYWORDS) as [TopicCluster, string[]][]) {
    if (cluster === 'general') continue;
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCluster = cluster;
    }
  }

  return bestCluster;
}

export const CLUSTER_LABELS: Record<TopicCluster, string> = {
  bidding: 'Bidding & Smart Bidding',
  creative: 'Ad Copy & Creative',
  audiences: 'Audiences & Targeting',
  measurement: 'Tracking & Measurement',
  automation: 'Automation & Scripts',
  policy: 'Policy & Compliance',
  shopping: 'Shopping & PMax',
  video: 'YouTube & Video',
  local: 'Local & Maps',
  budget: 'Budget & ROI',
  'account-structure': 'Account Structure',
  general: 'Google Ads Strategy',
};
