import type { Env, TopicCluster } from './types';

const TOPIC_PROMPTS: Record<TopicCluster, string> = {
  bidding: 'digital dashboard showing automated bidding curves and optimization metrics',
  creative: 'creative workspace with ad mockups and headline variations on screens',
  audiences: 'network visualization of connected audience segments and user profiles',
  measurement: 'analytics dashboard with conversion funnels and attribution paths',
  automation: 'robotic arms managing multiple campaign controls on a command center',
  policy: 'shield and compliance checklist with approval stamps',
  shopping: 'product feed grid with shopping cart and merchant data flowing',
  video: 'video player interface with engagement metrics and youtube analytics',
  local: 'city map with location pins and local business search results',
  budget: 'financial chart with budget allocation bars and ROI indicators',
  'account-structure': 'organized tree diagram of campaign account hierarchy',
  general: 'modern advertising technology workspace with AI interface elements',
};

export async function generateHeroImage(
  env: Env, slug: string, topicCluster: TopicCluster
): Promise<string | null> {
  try {
    const topicScene = TOPIC_PROMPTS[topicCluster] || TOPIC_PROMPTS.general;
    const prompt = `Professional minimalist illustration for a PPC advertising blog post: ${topicScene}. Dark background (#08080d), amber (#f0a830) accent color, clean modern style, no text, wide aspect ratio 1200x630, subtle gradient lighting`;

    const result = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
      prompt,
      num_steps: 30,
      width: 1024,
      height: 576,
    });

    if (!result) {
      console.warn('[images] Workers AI returned empty result');
      return null;
    }

    const key = `heroes/${slug}.png`;
    const imageData = result as ArrayBuffer;
    await env.BLOG_ASSETS.put(key, imageData, {
      httpMetadata: { contentType: 'image/png' },
    });

    console.log(`[images] Generated and stored hero image: ${key}`);
    return key;
  } catch (err) {
    console.warn('[images] Hero image generation failed, using fallback:', (err as Error).message);
    return null;
  }
}

const FALLBACK_IMAGES: Record<TopicCluster, string> = {
  bidding: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
  creative: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&h=630&fit=crop',
  audiences: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop',
  measurement: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
  automation: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
  policy: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=630&fit=crop',
  shopping: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop',
  video: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop',
  local: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=630&fit=crop',
  budget: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop',
  'account-structure': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
  general: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
};

export function getFallbackImage(topicCluster: TopicCluster): string {
  return FALLBACK_IMAGES[topicCluster] || FALLBACK_IMAGES.general;
}
