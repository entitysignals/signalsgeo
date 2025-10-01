/**
 * Initialize default scoring version
 * Run this once to set up the initial scoring weights
 */

import { createClient } from '@supabase/supabase-js';
import { DEFAULT_SCORING_WEIGHTS } from '../lib/scoring/default-weights';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function initializeScoringVersion() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check if any active version exists
  const { data: existing } = await supabase
    .from('scoring_weights')
    .select('*')
    .eq('is_active', true)
    .single();

  if (existing) {
    console.log('✅ Active scoring version already exists:', existing.scoring_version);
    return;
  }

  // Create default v1.0 version
  const { data, error } = await supabase
    .from('scoring_weights')
    .insert({
      scoring_version: 'v1.0',
      weights: DEFAULT_SCORING_WEIGHTS,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating scoring version:', error);
    process.exit(1);
  }

  console.log('✅ Created default scoring version v1.0');
  console.log(data);
}

initializeScoringVersion();

