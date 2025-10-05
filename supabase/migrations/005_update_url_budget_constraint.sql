-- Update url_budget constraint to allow new values: 15, 35, 60, 100
-- Drop the old constraint
ALTER TABLE runs DROP CONSTRAINT IF EXISTS runs_url_budget_check;

-- Add new constraint with updated values
ALTER TABLE runs ADD CONSTRAINT runs_url_budget_check 
  CHECK (url_budget IN (15, 20, 35, 60, 100, 150));
