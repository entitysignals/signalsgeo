# Migration 004: Add scenario_title Column

## The Problem
The code is trying to insert `scenario_title` into the `queries` table, but this column doesn't exist in your Supabase database yet.

## The Fix
You need to run this SQL migration in your Supabase dashboard.

## Steps to Fix:

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (signalsgeo)
3. **Click "SQL Editor"** in the left sidebar
4. **Click "New Query"**
5. **Copy and paste this SQL**:

```sql
-- Add scenario_title column to queries table
ALTER TABLE queries ADD COLUMN IF NOT EXISTS scenario_title TEXT;

-- Add comment for documentation
COMMENT ON COLUMN queries.scenario_title IS 'Human-readable title for the scenario (e.g., "Brand Overview", "Trust & Legitimacy")';
```

6. **Click "Run"** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

## Verify it worked:
Run this query to check:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'queries' 
AND column_name = 'scenario_title';
```

You should see:
```
column_name      | data_type
-----------------|-----------
scenario_title   | text
```

## After Migration:
- The worker will now be able to create queries with `scenario_title`
- New scans will show scenario names in the "AI Discoverability" details
- Old scans won't have scenario titles (they'll show as empty)

## Rollback (if needed):
If you need to undo this migration:
```sql
ALTER TABLE queries DROP COLUMN IF EXISTS scenario_title;
```

