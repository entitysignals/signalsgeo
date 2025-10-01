-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations table
create table organizations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  brand_name text not null,
  domain text not null,
  industry text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table organizations enable row level security;

-- RLS policies for organizations
create policy "Users can view their own organizations"
  on organizations for select
  using (owner_user_id = auth.uid());

create policy "Users can create their own organizations"
  on organizations for insert
  with check (owner_user_id = auth.uid());

create policy "Users can update their own organizations"
  on organizations for update
  using (owner_user_id = auth.uid());

create policy "Users can delete their own organizations"
  on organizations for delete
  using (owner_user_id = auth.uid());

-- Organization members
create table org_members (
  org_id uuid references organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'owner',
  primary key (org_id, user_id)
);

alter table org_members enable row level security;

create policy "Users can view org members if they are a member"
  on org_members for select
  using (user_id = auth.uid() or org_id in (
    select org_id from org_members where user_id = auth.uid()
  ));

create policy "Users can insert themselves as members"
  on org_members for insert
  with check (user_id = auth.uid());

create policy "Owners can update org members"
  on org_members for update
  using (org_id in (
    select org_id from org_members where user_id = auth.uid() and role = 'owner'
  ));

create policy "Owners can delete org members"
  on org_members for delete
  using (org_id in (
    select org_id from org_members where user_id = auth.uid() and role = 'owner'
  ));

-- Runs table
create table runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  scoring_version text not null,
  url_budget int not null check (url_budget in (20,60,150)),
  started_at timestamptz default now(),
  finished_at timestamptz,
  total_score numeric,
  readiness_rank text,
  status text not null default 'queued' -- queued|running|done|failed
);

alter table runs enable row level security;

create policy "Users can view runs for their organizations"
  on runs for select
  using (org_id in (
    select org_id from org_members where user_id = auth.uid()
  ));

create policy "Users can create runs for their organizations"
  on runs for insert
  with check (org_id in (
    select org_id from org_members where user_id = auth.uid()
  ));

-- Queries (six scenarios)
create table queries (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references runs(id) on delete cascade,
  scenario_key text not null, -- s1..s6
  prompt text not null,
  locale text not null default 'en-CA'
);

alter table queries enable row level security;

create policy "Users can view queries for their runs"
  on queries for select
  using (run_id in (
    select id from runs where org_id in (
      select org_id from org_members where user_id = auth.uid()
    )
  ));

-- Answers from providers
create table answers (
  id uuid primary key default gen_random_uuid(),
  query_id uuid references queries(id) on delete cascade,
  provider text not null, -- perplexity|brave_summarizer
  answer_text text not null,
  citations jsonb not null, -- [{url, domain}]
  features jsonb not null,  -- {brand_mentioned, self_cited, tier_a_present, competitor_count}
  raw_json jsonb not null,
  retrieved_at timestamptz default now()
);

alter table answers enable row level security;

create policy "Users can view answers for their queries"
  on answers for select
  using (query_id in (
    select id from queries where run_id in (
      select id from runs where org_id in (
        select org_id from org_members where user_id = auth.uid()
      )
    )
  ));

-- Crawled pages
create table crawled_pages (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references runs(id) on delete cascade,
  url text not null,
  status int,
  main_text text,
  html_hash text,
  passed_checks jsonb default '{}'::jsonb  -- per-page check booleans
);

alter table crawled_pages enable row level security;

create policy "Users can view crawled pages for their runs"
  on crawled_pages for select
  using (run_id in (
    select id from runs where org_id in (
      select org_id from org_members where user_id = auth.uid()
    )
  ));

-- Metric rollups
create table metrics (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references runs(id) on delete cascade,
  content_quality_score numeric,
  technical_foundation_score numeric,
  authority_trust_score numeric,
  prompt_scenarios_score numeric
);

alter table metrics enable row level security;

create policy "Users can view metrics for their runs"
  on metrics for select
  using (run_id in (
    select id from runs where org_id in (
      select org_id from org_members where user_id = auth.uid()
    )
  ));

-- Evidence snapshots
create table snapshots (
  id uuid primary key default gen_random_uuid(),
  answer_id uuid references answers(id) on delete cascade,
  html_fragment text,
  image_path text,
  created_at timestamptz default now()
);

alter table snapshots enable row level security;

create policy "Users can view snapshots for their answers"
  on snapshots for select
  using (answer_id in (
    select id from answers where query_id in (
      select id from queries where run_id in (
        select id from runs where org_id in (
          select org_id from org_members where user_id = auth.uid()
        )
      )
    )
  ));

-- Scoring weights (admin-editable)
create table scoring_weights (
  id uuid primary key default gen_random_uuid(),
  scoring_version text not null unique,
  weights jsonb not null,
  created_at timestamptz default now(),
  is_active boolean default false
);

-- Only one active version at a time
create unique index scoring_weights_active_idx on scoring_weights (is_active) where is_active = true;

-- Logs table
create table logs (
  id uuid primary key default gen_random_uuid(),
  level text not null,
  message text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Indexes for performance
create index runs_org_id_idx on runs(org_id);
create index runs_status_idx on runs(status);
create index queries_run_id_idx on queries(run_id);
create index answers_query_id_idx on answers(query_id);
create index crawled_pages_run_id_idx on crawled_pages(run_id);
create index logs_created_at_idx on logs(created_at);
