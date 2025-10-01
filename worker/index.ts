/**
 * Background Job Worker
 * 
 * This worker polls the jobs table and processes pending jobs.
 * Can be run locally or deployed as a separate service.
 * 
 * Usage:
 *   npm run worker
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { processCrawlJob } from './processors/crawl';
import { processProvidersJob } from './processors/providers';
import { processScoringJob } from './processors/scoring';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nMake sure your .env.local file exists and contains these values.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const POLL_INTERVAL = 5000; // 5 seconds
const MAX_CONCURRENT_JOBS = 3;

let activeJobs = 0;

async function pollJobs() {
  if (activeJobs >= MAX_CONCURRENT_JOBS) {
    console.log('Max concurrent jobs reached, skipping poll');
    return;
  }

  try {
    // Fetch pending jobs
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(MAX_CONCURRENT_JOBS - activeJobs);

    if (error) {
      console.error('Error fetching jobs:', error);
      return;
    }

    if (!jobs || jobs.length === 0) {
      return;
    }

    console.log(`Found ${jobs.length} pending jobs`);

    // Process each job
    for (const job of jobs) {
      processJob(job);
    }
  } catch (error) {
    console.error('Poll error:', error);
  }
}

async function processJob(job: any) {
  activeJobs++;

  try {
    console.log(`Processing job ${job.id} (${job.type})`);

    // Mark job as running
    await supabase
      .from('jobs')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
        attempts: job.attempts + 1,
      })
      .eq('id', job.id);

    // Update run status
    await supabase
      .from('runs')
      .update({ status: 'running' })
      .eq('id', job.run_id);

    // Process based on job type
    let result;
    switch (job.type) {
      case 'crawl':
        result = await processCrawlJob(job, supabase);
        break;
      case 'query_providers':
        result = await processProvidersJob(job, supabase);
        break;
      case 'calculate_score':
        result = await processScoringJob(job, supabase);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }

    // Mark job as completed
    await supabase
      .from('jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', job.id);

    // Don't set run status to 'done' here - let the scoring job do it
    // This prevents showing "Done" before AI queries and scoring complete

    console.log(`Job ${job.id} completed successfully`);
  } catch (error: any) {
    console.error(`Job ${job.id} failed:`, error);

    // Mark job as failed
    await supabase
      .from('jobs')
      .update({
        status: job.attempts + 1 >= job.max_attempts ? 'failed' : 'pending',
        error: error.message,
        completed_at: job.attempts + 1 >= job.max_attempts ? new Date().toISOString() : null,
      })
      .eq('id', job.id);

    // Update run status if max attempts reached
    if (job.attempts + 1 >= job.max_attempts) {
      await supabase
        .from('runs')
        .update({ status: 'failed' })
        .eq('id', job.run_id);
    }
  } finally {
    activeJobs--;
  }
}

// Start the worker
console.log('🚀 SignalsGEO Worker started');
console.log(`Polling every ${POLL_INTERVAL}ms`);
console.log(`Max concurrent jobs: ${MAX_CONCURRENT_JOBS}`);

// Initial poll
pollJobs();

// Set up polling interval
setInterval(pollJobs, POLL_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Worker shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Worker shutting down...');
  process.exit(0);
});
