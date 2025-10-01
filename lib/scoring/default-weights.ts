/**
 * Default scoring weights for GEO Scorecard v1.0
 * Total: 100 points across 4 sections
 */

export const DEFAULT_SCORING_WEIGHTS = {
  contentQuality: {
    total: 40,
    conversationalTone: 8,
    qaContent: 8,
    headingStructure: 6,
    expertiseSignals: 6,
    accuracyEvidence: 4,
    semanticRichness: 4,
    entityClarity: 4,
  },
  technicalFoundation: {
    total: 20,
    jsDependenceMin: 8,
    pageSpeed: 4,
    structuredData: 3,
    crawlabilityHealth: 3,
    contentAccessibility: 2,
  },
  authorityTrust: {
    total: 15,
    citationWorthiness: 7,
    domainAuthority: 5,
    socialProof: 1,
    trustIndicators: 2,
  },
  promptScenarios: {
    total: 25,
    perScenario: 4.17,
    mentionCoverage: 2.0,
    selfPresence: 1.3,
    citationQuality: 0.6,
    competitorShare: 0.27,
  },
};

export const READINESS_RANKS = [
  { min: 0, max: 14, label: "Not discoverable at all" },
  { min: 15, max: 34, label: "Not discoverable unless directly requested" },
  { min: 35, max: 54, label: "Discoverable" },
  { min: 55, max: 69, label: "Sometimes referenced" },
  { min: 70, max: 84, label: "Frequently referenced" },
  { min: 85, max: 100, label: "Top reference" },
];

export function getReadinessRank(score: number): string {
  const rank = READINESS_RANKS.find((r) => score >= r.min && score <= r.max);
  return rank?.label || "Unknown";
}

