CREATE TABLE IF NOT EXISTS pickups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  pickup_address text NOT NULL,
  preferred_pickup timestamptz NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert pickups" ON pickups FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read pickups" ON pickups FOR SELECT USING (auth.role() = 'authenticated');
