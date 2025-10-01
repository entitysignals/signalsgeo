# Background Worker Setup

## ✅ What Changed

The crawl engine now runs as a **background worker** instead of in the web server. This means:
- ✅ Scans run independently (close your laptop, they keep going)
- ✅ Works in production (no Vercel timeout limits)
- ✅ Proper job queue with retries
- ✅ Can be deployed to cloud services

---

## 🔧 Setup Steps

### Step 1: Run Database Migration

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Click "+ New query"**
3. **Paste this SQL**:

```sql
-- Job Queue Table
create table jobs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references runs(id) on delete cascade,
  type text not null,
  status text not null default 'pending',
  payload jsonb not null,
  error text,
  attempts int default 0,
  max_attempts int default 3,
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create index jobs_status_created_idx on jobs(status, created_at);
create index jobs_run_id_idx on jobs(run_id);
```

4. **Click "Run"**
5. You should see: **"Success. No rows returned"**

### Step 2: Start the Background Worker

**Open a NEW terminal/PowerShell window** (keep your `pnpm dev` running in the other one):

```bash
cd "C:\Users\redpi\Desktop\Redefinition Tech website\redefinition_suite\apps\signals_geo"
pnpm worker
```

You should see:
```
🚀 SignalsGEO Worker started
Polling every 5000ms
Max concurrent jobs: 3
```

**Keep this window open!** The worker needs to run continuously.

---

## 🧪 Testing

1. **Make sure BOTH are running**:
   - Terminal 1: `pnpm dev` (web server)
   - Terminal 2: `pnpm worker` (background jobs)

2. **Start a new scan** in the browser

3. **Watch the worker terminal** - you'll see:
   ```
   Found 1 pending jobs
   Processing job <id> (crawl)
   Starting crawl for <domain> with budget 20
   Crawling: https://...
   Job <id> completed successfully
   ```

4. **The browser auto-refreshes** every 5 seconds to show progress

---

## ⚙️ How It Works

```
User clicks "Start Scan"
    ↓
API creates a "job" in database (status: pending)
    ↓
Background worker polls every 5 seconds
    ↓
Worker finds pending job
    ↓
Worker processes crawl (fetches pages, analyzes content)
    ↓
Worker marks job as "completed"
    ↓
User sees results in browser
```

---

## 🚀 Production Deployment

For production, you can deploy the worker to:
- **Railway** (easiest - runs Node.js workers)
- **Render** (background workers)
- **Vercel Cron** (run worker every minute)
- **Supabase Edge Functions** (convert to edge function)

We'll set this up when you're ready to deploy!

---

## ❓ Troubleshooting

**Scan stays "Queued" forever?**
- Check that `pnpm worker` is running
- Look for errors in the worker terminal

**"Job failed" errors?**
- Check the worker terminal for stack traces
- The job will retry up to 3 times automatically

**Want to stop the worker?**
- Press `Ctrl + C` in the worker terminal


