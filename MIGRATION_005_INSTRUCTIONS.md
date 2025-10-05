# Migration 005: Update URL Budget Constraint

## What This Does
Updates the `runs` table to allow the new URL budget values: 15, 35, 60, 100 (in addition to the old 20, 60, 150).

## How to Run

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `signals_geo` or `signalsgeo`
3. **Click "SQL Editor"** in the left sidebar
4. **Click "New Query"**
5. **Copy and paste this SQL**:

```sql
-- Update url_budget constraint to allow new values: 15, 35, 60, 100
-- Drop the old constraint
ALTER TABLE runs DROP CONSTRAINT IF EXISTS runs_url_budget_check;

-- Add new constraint with updated values
ALTER TABLE runs ADD CONSTRAINT runs_url_budget_check 
  CHECK (url_budget IN (15, 20, 35, 60, 100, 150));
```

6. **Click "Run"** (or press Ctrl+Enter)
7. **Verify success**: You should see "Success. No rows returned"

## What Changed
- **Old allowed values**: 20, 60, 150
- **New allowed values**: 15, 20, 35, 60, 100, 150

This allows users to:
- Use the new smart default of **35 pages**
- Choose quick scans with **15 pages**
- Choose deep scans with **100 pages**
- Still use the old values if needed

## After Running
Once this migration is complete, users will be able to create scans with the new URL budget options!
