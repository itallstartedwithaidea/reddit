export interface Env {
  DB: D1Database;
  BLOG_DATA: KVNamespace;
  BLOG_ASSETS: R2Bucket;
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  ANTHROPIC_API_KEY: string;
  SEARCHAPI_KEY: string;
  GITHUB_TOKEN: string;
  EMAIL_TO?: string;
  SMS_GATEWAY_TO?: string;
  CRON_SECRET: string;
  SITE_URL: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  MAX_POSTS_PER_RUN: string;
  MAX_DAILY_GENERATIONS: string;
  MAX_MONTHLY_USD: string;
  ENVIRONMENT: string;
}

export interface RedditThread {
  redditId: string;
  title: string;
  selftext: string;
  url: string;
  subreddit: string;
  score: number;
  numComments: number;
  snippet: string;
}

export interface PostRecord {
  id?: number;
  reddit_id: string;
  reddit_url: string;
  subreddit: string;
  title: string;
  slug: string;
  status: PostStatus;
  skip_reason?: string;
  topic_cluster?: string;
  word_count?: number;
  hero_image_key?: string;
  published_url?: string;
  error_message?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  generation_cost_usd?: number;
}

export type PostStatus = 'skipped' | 'queued' | 'generating' | 'draft_ready' | 'published' | 'failed';

export type TopicCluster =
  | 'bidding'
  | 'creative'
  | 'audiences'
  | 'measurement'
  | 'automation'
  | 'policy'
  | 'shopping'
  | 'video'
  | 'local'
  | 'budget'
  | 'account-structure'
  | 'general';

export interface GeneratedArticle {
  html: string;
  title: string;
  slug: string;
  description: string;
  wordCount: number;
  topicCluster: TopicCluster;
  relatedPosts: RelatedPost[];
}

export interface RelatedPost {
  title: string;
  slug: string;
  url: string;
}

export interface BlogManifestEntry {
  title: string;
  slug: string;
  description: string;
  url: string;
  topicCluster: TopicCluster;
  publishedAt: string;
  heroImage?: string;
  redditUrl: string;
}

export interface RunStats {
  runId: string;
  postsSeen: number;
  postsFiltered: number;
  postsGenerated: number;
  postsPublished: number;
  postsFailed: number;
  publishedPosts: { title: string; url: string }[];
}
