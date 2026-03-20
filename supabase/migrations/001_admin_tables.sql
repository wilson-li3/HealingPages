-- Impact stats (one row per stat)
CREATE TABLE site_stats (
  id TEXT PRIMARY KEY,
  value INTEGER NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Seed with current values
INSERT INTO site_stats (id, value, label, display_order) VALUES
  ('books_collected', 500, 'Books Collected', 0),
  ('read_alouds', 10, 'Read-Aloud Sessions', 1),
  ('schools_impacted', 10, 'Schools Impacted', 2);

-- Polaroid images
CREATE TABLE polaroids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  image_url TEXT,
  caption TEXT NOT NULL,
  x TEXT NOT NULL,
  y TEXT NOT NULL,
  rotation REAL NOT NULL DEFAULT 0,
  width INTEGER NOT NULL DEFAULT 175,
  illustration TEXT DEFAULT 'reading',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- RLS: anyone can read, only authenticated users can write
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE polaroids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read stats" ON site_stats FOR SELECT USING (true);
CREATE POLICY "Auth write stats" ON site_stats FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read polaroids" ON polaroids FOR SELECT USING (true);
CREATE POLICY "Auth write polaroids" ON polaroids FOR ALL USING (auth.role() = 'authenticated');

-- Site settings (key-value store for misc config like founder photo)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Auth write settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Seed polaroid data from hardcoded arrays
INSERT INTO polaroids (section, caption, x, y, rotation, width, illustration, display_order) VALUES
  -- Impact section
  ('impact', 'Book drive day!', '-2%', '5%', -8, 190, 'stacking', 0),
  ('impact', 'So many stories', '75%', '3%', 5, 180, 'bookshelf', 1),
  ('impact', 'Reading buddies', '35%', '65%', -3, 170, 'sharing', 2),
  ('impact', 'Storytime!', '78%', '58%', 6, 175, 'storytime', 3),
  ('impact', 'New friends', '8%', '55%', 4, 160, 'reading', 4),
  -- Medical section
  ('medical', 'Hospital visit', '-3%', '8%', 5, 185, 'reading', 0),
  ('medical', 'Healthy minds', '42%', '2%', -4, 170, 'stacking', 1),
  ('medical', 'Dr. Books!', '78%', '50%', -6, 180, 'storytime', 2),
  ('medical', 'Check-up day', '20%', '60%', 3, 165, 'bookshelf', 3),
  -- About section
  ('about', 'Where it started', '72%', '5%', -5, 185, 'stacking', 0),
  ('about', 'First delivery', '-2%', '55%', 4, 175, 'sharing', 1),
  ('about', 'Growing up', '55%', '60%', -3, 165, 'reading', 2),
  -- Partners section
  ('partners', 'Team work!', '-2%', '5%', 5, 180, 'storytime', 0),
  ('partners', 'Book sorting day', '76%', '8%', -4, 175, 'stacking', 1),
  ('partners', 'At the library', '40%', '58%', 3, 185, 'bookshelf', 2),
  ('partners', 'Together', '5%', '55%', -6, 165, 'sharing', 3),
  ('partners', 'Making a difference', '72%', '55%', 5, 170, 'reading', 4),
  -- Acknowledgements section
  ('ack', 'Thank you!', '-1%', '3%', -5, 185, 'sharing', 0),
  ('ack', 'Volunteers rock', '75%', '5%', 6, 178, 'storytime', 1),
  ('ack', 'With love', '38%', '55%', -3, 170, 'reading', 2),
  -- Donate section
  ('donate', 'Share a story', '-2%', '6%', -6, 180, 'sharing', 0),
  ('donate', 'Books galore', '76%', '4%', 5, 175, 'stacking', 1),
  ('donate', 'Happy readers', '42%', '62%', -3, 170, 'reading', 2);
