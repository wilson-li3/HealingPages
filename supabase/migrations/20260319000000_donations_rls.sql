-- Enable Row Level Security on donations table
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert donations (form submissions)
CREATE POLICY "Allow anonymous inserts"
  ON donations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- No SELECT, UPDATE, or DELETE for anon — protects PII
-- Authenticated/service_role can still access via Supabase dashboard or server-side
