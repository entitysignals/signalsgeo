import { calculateScores } from '../../lib/scoring/calculator';

export async function processScoringJob(job: any, supabase: any) {
  const { runId } = job.payload;

  console.log(`Calculating scores for run ${runId}`);

  // 1. Get active scoring weights
  const { data: scoringVersion } = await supabase
    .from('scoring_weights')
    .select('*')
    .eq('is_active', true)
    .single();

  if (!scoringVersion) {
    throw new Error('No active scoring version found');
  }

  const weights = scoringVersion.weights;

  // 2. Get crawled pages
  const { data: pages } = await supabase
    .from('crawled_pages')
    .select('*')
    .eq('run_id', runId);

  // 3. Get queries and answers
  const { data: queries } = await supabase
    .from('queries')
    .select(`
      *,
      answers(*)
    `)
    .eq('run_id', runId);

  // 4. Calculate scores
  const scores = calculateScores(pages || [], queries || [], weights);

  console.log('Calculated scores:', scores);

  // 5. Save to metrics table
  await supabase.from('metrics').insert({
    run_id: runId,
    content_quality_score: scores.contentQualityScore,
    technical_foundation_score: scores.technicalScore,
    authority_trust_score: scores.authorityScore,
    prompt_scenarios_score: scores.scenariosScore,
  });

  // 6. Update run with total score and readiness rank
  await supabase
    .from('runs')
    .update({
      total_score: scores.totalScore,
      readiness_rank: scores.readinessRank,
      finished_at: new Date().toISOString(),
      status: 'done',
    })
    .eq('id', runId);

  console.log(`✓ Scoring complete for run ${runId}: ${scores.totalScore}/100 (${scores.readinessRank})`);

  return {
    totalScore: scores.totalScore,
    readinessRank: scores.readinessRank,
  };
}


