-- Add DELETE policy for runs table (was missing!)
create policy "Users can delete runs for their organizations"
  on runs for delete
  using (
    org_id in (
      select id from organizations where owner_user_id = auth.uid()
    )
  );

-- Add UPDATE policy for runs (also missing)
create policy "Users can update runs for their organizations"
  on runs for update
  using (
    org_id in (
      select id from organizations where owner_user_id = auth.uid()
    )
  );


