import { createClient } from '@/lib/supabase/server';
import { DEFAULT_SCORING_WEIGHTS } from '@/lib/scoring/default-weights';
import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function POST() {
  try {
    // Check admin authentication
    const isAdminAuth = await checkAdminAuth();
    if (!isAdminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Check if any active version exists
    const { data: existing } = await supabase
      .from('scoring_weights')
      .select('*')
      .eq('is_active', true)
      .single();

    if (existing) {
      return NextResponse.json({
        message: 'Active scoring version already exists',
        version: existing.scoring_version,
      });
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

    if (error) throw error;

    return NextResponse.json({
      message: 'Created default scoring version v1.0',
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to initialize scoring version' },
      { status: 500 }
    );
  }
}
