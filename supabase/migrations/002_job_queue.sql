-- Job Queue Table
create table jobs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references runs(id) on delete cascade,
  type text not null, -- 'crawl', 'query_providers', 'calculate_score'
  status text not null default 'pending', -- pending|running|completed|failed
  payload jsonb not null,
  error text,
  attempts int default 0,
  max_attempts int default 3,
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- Index for efficient job polling
create index jobs_status_created_idx on jobs(status, created_at);
create index jobs_run_id_idx on jobs(run_id);

-- No RLS on jobs table - it's accessed by background workers with service role

