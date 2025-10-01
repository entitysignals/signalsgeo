import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orgId, urlBudget, locale } = await request.json();

    const supabase = await createClient();

    // Verify user has access to this organization
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization details
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get active scoring version
    const { data: scoringVersion } = await supabase
      .from('scoring_weights')
      .select('*')
      .eq('is_active', true)
      .single();

    if (!scoringVersion) {
      return NextResponse.json(
        { error: 'No active scoring version. Please contact admin.' },
        { status: 400 }
      );
    }

    // Create run record
    const { data: run, error: runError } = await supabase
      .from('runs')
      .insert({
        org_id: orgId,
        scoring_version: scoringVersion.scoring_version,
        url_budget: urlBudget,
        status: 'queued',
      })
      .select()
      .single();

    if (runError || !run) {
      console.error('Run creation error:', runError);
      return NextResponse.json({ 
        error: 'Failed to create run', 
        details: runError?.message 
      }, { status: 500 });
    }

    // Create a job for the background worker
    const { error: jobError } = await supabase
      .from('jobs')
      .insert({
        run_id: run.id,
        type: 'crawl',
        status: 'pending',
        payload: {
          domain: org.domain,
          urlBudget: urlBudget,
          locale: locale,
        },
      });

    if (jobError) {
      console.error('Job creation error:', jobError);
      // Clean up the run
      await supabase.from('runs').delete().eq('id', run.id);
      return NextResponse.json({ 
        error: 'Failed to queue job',
        details: jobError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ runId: run.id });
  } catch (error: any) {
    console.error('Run API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start run' },
      { status: 500 }
    );
  }
}
