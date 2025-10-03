import { queryPerplexity } from '../../lib/providers/perplexity';
import { queryBrave } from '../../lib/providers/brave';
import { SCENARIOS } from '../../lib/providers/scenarios';
import { extractFeatures } from '../../lib/providers/features';
import { getCacheKey, getFromCache, setInCache } from '../../lib/providers/cache';

export async function processProvidersJob(job: any, supabase: any) {
  const { brandName, domain, industry, runId } = job.payload;

  console.log(`Querying AI providers for ${brandName}`);

  // For each scenario, query both providers
  for (const scenario of SCENARIOS) {
    const prompt = scenario.getPrompt(brandName, domain, industry);

    console.log(`Scenario ${scenario.key}: ${scenario.title}`);

    // Create query record
    const { data: query, error: queryError } = await supabase
      .from('queries')
      .insert({
        run_id: runId,
        scenario_key: scenario.key,
        scenario_title: scenario.title,
        prompt,
        locale: 'en-CA',
      })
      .select()
      .single();

    if (queryError) {
      console.error('Failed to create query:', queryError);
      continue;
    }

    // Query Perplexity
    try {
      const cacheKey = getCacheKey('perplexity', prompt, 'en-CA', brandName);
      let response = getFromCache(cacheKey);

      if (!response) {
        console.log('  Querying Perplexity...');
        response = await queryPerplexity(prompt, 'en-CA');
        setInCache(cacheKey, response);
      } else {
        console.log('  Using cached Perplexity response');
      }

      const features = extractFeatures(response, brandName, domain);

      await supabase.from('answers').insert({
        query_id: query.id,
        provider: 'perplexity',
        answer_text: response.answer_text,
        citations: response.citations,
        features,
        raw_json: response.raw_json,
      });

      // Rate limiting (Perplexity allows ~1 req/sec)
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error: any) {
      console.error('  Perplexity error:', error.message);
    }

    // Query Brave
    try {
      const cacheKey = getCacheKey('brave_search', prompt, 'en-CA', brandName);
      let response = getFromCache(cacheKey);

      if (!response) {
        console.log('  Querying Brave...');
        response = await queryBrave(prompt, 'en-CA');
        setInCache(cacheKey, response);
      } else {
        console.log('  Using cached Brave response');
      }

      const features = extractFeatures(response, brandName, domain);

      await supabase.from('answers').insert({
        query_id: query.id,
        provider: 'brave_search',
        answer_text: response.answer_text,
        citations: response.citations,
        features,
        raw_json: response.raw_json,
      });

      // Rate limiting (Brave paid plan: 20 req/sec, but let's be conservative)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error('  Brave error:', error.message);
    }
  }

  console.log(`Completed AI queries for ${brandName}`);

  // After providers complete, create a scoring job
  console.log('Creating scoring job...');
  
  await supabase.from('jobs').insert({
    run_id: runId,
    type: 'calculate_score',
    status: 'pending',
    payload: {
      runId,
    },
  });

  console.log('✓ Scoring job created');

  return {
    scenariosQueried: SCENARIOS.length,
    providersUsed: 2,
  };
}
