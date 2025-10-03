-- Add scenario_title column to queries table
ALTER TABLE queries ADD COLUMN IF NOT EXISTS scenario_title TEXT;

-- Add comment for documentation
COMMENT ON COLUMN queries.scenario_title IS 'Human-readable title for the scenario (e.g., "Brand Overview", "Trust & Legitimacy")';

