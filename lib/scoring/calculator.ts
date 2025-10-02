interface ScoringWeights {
  contentQuality: {
    total: number;
    conversationalTone: number;
    qaContent: number;
    headingStructure: number;
    expertiseSignals: number;
    accuracyEvidence: number;
    semanticRichness: number;
    entityClarity: number;
  };
  technicalFoundation: {
    total: number;
    pageSpeed: number;
    structuredData: number;
    jsDependenceMin: number;
    crawlabilityHealth: number;
    contentAccessibility: number;
  };
  authorityTrust: {
    total: number;
    socialProof: number;
    domainAuthority: number;
    trustIndicators: number;
    citationWorthiness: number;
  };
  promptScenarios: {
    total: number;
    perScenario: number;
    selfPresence: number;
    citationQuality: number;
    competitorShare: number;
    mentionCoverage: number;
  };
}

interface CrawledPage {
  passed_checks: any;
}

interface Answer {
  provider: string;
  features: {
    brand_mentioned: boolean;
    self_cited: boolean;
    tier_a_present: boolean;
    competitor_count: number;
  };
}

interface Query {
  answers: Answer[];
}

export function calculateScores(
  pages: CrawledPage[],
  queries: Query[],
  weights: ScoringWeights
) {
  // 1. Content Quality Score (40 points)
  const contentQualityScore = calculateContentQuality(pages, weights.contentQuality);

  // 2. Technical Foundation Score (20 points)
  const technicalScore = calculateTechnicalFoundation(pages, weights.technicalFoundation);

  // 3. Authority & Trust Score (15 points)
  const authorityScore = calculateAuthorityTrust(queries, weights.authorityTrust);

  // 4. Prompt Scenarios Score (25 points)
  const scenariosScore = calculatePromptScenarios(queries, weights.promptScenarios);

  // Total score (0-100)
  const totalScore = contentQualityScore + technicalScore + authorityScore + scenariosScore;

  // Readiness rank
  const readinessRank = getReadinessRank(totalScore);

  return {
    contentQualityScore,
    technicalScore,
    authorityScore,
    scenariosScore,
    totalScore,
    readinessRank,
  };
}

function calculateContentQuality(pages: CrawledPage[], weights: any): number {
  if (!pages || pages.length === 0) return 0;

  let score = 0;
  let totalChecks = 0;
  let passedChecks = 0;

  // Content quality checks (exclude technical/schema checks)
  const contentChecks = [
    'faq_present',
    'question_headings',
    'h1_ok',
    'headings_hierarchy_ok',
    'byline_present',
    'updated_date_present',
    'outbound_citations_present',
    'glossary_terms_present',
    'internal_linking_ok',
  ];

  // Aggregate content quality checks from all pages
  for (const page of pages) {
    const checks = page.passed_checks || {};
    
    for (const checkKey of contentChecks) {
      if (checkKey in checks) {
        totalChecks++;
        if (checks[checkKey] === true) passedChecks++;
      }
    }
  }

  // Calculate pass rate
  const passRate = totalChecks > 0 ? passedChecks / totalChecks : 0;

  // Apply weight
  score = passRate * weights.total;

  return Math.round(score * 100) / 100;
}

function calculateTechnicalFoundation(pages: CrawledPage[], weights: any): number {
  if (!pages || pages.length === 0) return 0;

  let score = 0;
  let totalChecks = 0;
  let passedChecks = 0;

  // Technical checks from crawled pages
  for (const page of pages) {
    const checks = page.passed_checks || {};
    
    // Count technical-related checks matching actual checker output
    const technicalChecks = [
      'org_schema_present',
      'website_schema_present',
      'product_service_schema_present',
      'alt_text_ok',
      'canonical_ok',
      'robots_ok',
      'sitemap_ok',
      'contrast_ok',
    ];

    for (const checkKey of technicalChecks) {
      if (checkKey in checks) {
        totalChecks++;
        if (checks[checkKey]) passedChecks++;
      }
    }
    
    // Handle js_dependence_level (string value)
    if ('js_dependence_level' in checks) {
      totalChecks++;
      if (checks['js_dependence_level'] === 'low') {
        passedChecks++; // Full credit for low JS
      } else if (checks['js_dependence_level'] === 'medium') {
        passedChecks += 0.5; // Half credit for medium JS
      }
      // No credit for high JS dependence
    }
  }

  const passRate = totalChecks > 0 ? passedChecks / totalChecks : 0;
  score = passRate * weights.total;

  return Math.round(score * 100) / 100;
}

function calculateAuthorityTrust(queries: Query[], weights: any): number {
  if (!queries || queries.length === 0) return 0;

  let tierACount = 0;
  let totalAnswers = 0;

  // Count Tier A citations across all answers
  for (const query of queries) {
    if (query.answers) {
      for (const answer of query.answers) {
        totalAnswers++;
        if (answer.features?.tier_a_present) {
          tierACount++;
        }
      }
    }
  }

  const tierARate = totalAnswers > 0 ? tierACount / totalAnswers : 0;
  const score = tierARate * weights.total;

  return Math.round(score * 100) / 100;
}

function calculatePromptScenarios(queries: Query[], weights: any): number {
  if (!queries || queries.length === 0) return 0;

  let totalScore = 0;
  const scenarioCount = queries.length;

  for (const query of queries) {
    if (!query.answers || query.answers.length === 0) continue;

    let scenarioScore = 0;
    const answers = query.answers;

    // Check brand mentioned
    const brandMentioned = answers.some((a) => a.features?.brand_mentioned);
    if (brandMentioned) scenarioScore += weights.selfPresence;

    // Check self cited
    const selfCited = answers.some((a) => a.features?.self_cited);
    if (selfCited) scenarioScore += weights.citationQuality;

    // Check competitor share (lower is better)
    const avgCompetitorCount =
      answers.reduce((sum, a) => sum + (a.features?.competitor_count || 0), 0) / answers.length;
    const competitorPenalty = Math.min(avgCompetitorCount / 3, 1); // Cap at 1
    scenarioScore += weights.competitorShare * (1 - competitorPenalty);

    // Mention coverage (how many providers mentioned the brand)
    const mentionRate = answers.filter((a) => a.features?.brand_mentioned).length / answers.length;
    scenarioScore += weights.mentionCoverage * mentionRate;

    totalScore += scenarioScore;
  }

  // Average across scenarios
  const avgScore = scenarioCount > 0 ? totalScore / scenarioCount : 0;
  
  // Scale to total weight
  const finalScore = (avgScore / weights.perScenario) * weights.total;

  return Math.round(finalScore * 100) / 100;
}

function getReadinessRank(score: number): string {
  if (score >= 80) return 'Elite';
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'Moderate';
  if (score >= 35) return 'Weak';
  return 'Critical';
}


