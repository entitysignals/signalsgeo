import { ProviderResponse } from './perplexity';

export interface ExtractedFeatures {
  brand_mentioned: boolean;
  self_cited: boolean;
  tier_a_present: boolean;
  competitor_count: number;
}

// Tier A domains (high authority)
const TIER_A_DOMAINS = [
  'wikipedia.org',
  'gov',
  'edu',
  'bbc.com',
  'nytimes.com',
  'forbes.com',
  'reuters.com',
  'bloomberg.com',
  'wsj.com',
  'techcrunch.com',
  'theverge.com',
  'wired.com',
  'cnn.com',
  'theguardian.com',
];

export function extractFeatures(
  response: ProviderResponse,
  brandName: string,
  domain: string,
  competitors: string[] = []
): ExtractedFeatures {
  const answerLower = response.answer_text.toLowerCase();
  const brandLower = brandName.toLowerCase();
  const domainLower = domain.toLowerCase();

  // Check if brand is mentioned
  const brand_mentioned = answerLower.includes(brandLower) || answerLower.includes(domainLower);

  // Check if official domain is cited
  const self_cited = response.citations.some(
    (c) => c.domain.toLowerCase().includes(domainLower)
  );

  // Check for Tier A citations
  const tier_a_present = response.citations.some((c) =>
    TIER_A_DOMAINS.some(
      (tier) => c.domain.toLowerCase().includes(tier.toLowerCase())
    )
  );

  // Count competitor mentions
  let competitor_count = 0;
  for (const competitor of competitors) {
    if (answerLower.includes(competitor.toLowerCase())) {
      competitor_count++;
      if (competitor_count >= 3) break; // Cap at 3
    }
  }

  return {
    brand_mentioned,
    self_cited,
    tier_a_present,
    competitor_count,
  };
}

