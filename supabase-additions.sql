-- =============================================
--  Run this in Supabase SQL Editor
--  AFTER already running supabase-schema.sql
-- =============================================

-- 1. New blog categories
INSERT INTO public.categories (slug, label, description, icon, hero_image, gradient, sort_order) VALUES
  ('artificial-intelligence', 'Artificial Intelligence', 'Explore the world of AI — machine learning, neural networks, LLMs, and the future of intelligent systems.',  '🤖', 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80', 'from-violet-500 to-indigo-600',  5),
  ('finance',                 'Finance',                 'Navigate markets, investments, personal finance, and the economics shaping our world.',                       '💰', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80', 'from-emerald-500 to-green-600',  6),
  ('healthcare',              'Healthcare',              'Insights on medicine, mental health, wellness, and innovations transforming modern healthcare.',               '🏥', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80', 'from-red-500 to-rose-600',       7),
  ('education',               'Education',               'Ideas on learning, pedagogy, EdTech, and building a knowledge-driven future.',                                '📚', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80', 'from-amber-500 to-orange-600',   8),
  ('wildlife',                'Wildlife',                'Stories and facts about the remarkable animals, ecosystems, and biodiversity of our planet.',                 '🦁', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&q=80', 'from-lime-500 to-green-700',     9),
  ('technology',              'Technology',              'From gadgets to software to the internet — explore how technology is reshaping every corner of life.',        '💻', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80', 'from-sky-500 to-blue-600',      10)
ON CONFLICT (slug) DO NOTHING;

-- 2. Site settings table (for admin to manage contact info, social links, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "site_settings_admin_write"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Seed default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('contact_email',    'widespreadblogs@gmail.com'),
  ('contact_phone',    '+91 98765 43210'),
  ('contact_location', 'India'),
  ('admin_name',       'Sankalp Indish'),
  ('admin_role',       'Founder & Lead Developer'),
  ('admin_bio',        'Built Widespread Blogs to create a space where curious minds share their ideas with the world.'),
  ('admin_photo_url',  'https://api.dicebear.com/7.x/initials/svg?seed=Sankalp+Indish&backgroundColor=1CD6CE&textColor=1B2430'),
  ('github_url',       'https://github.com/DevelopingGod'),
  ('linkedin_url',     'https://www.linkedin.com/in/sankalp-indish/'),
  ('x_url',            'https://x.com/cutecreeperyt'),
  ('newsletter_url',   '')
ON CONFLICT (key) DO NOTHING;

-- 4. Newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can insert their own email (for subscribing)
CREATE POLICY "subscribers_insert_anyone"
  ON public.subscribers FOR INSERT WITH CHECK (true);

-- Only admins can read/delete subscribers
CREATE POLICY "subscribers_admin_all"
  ON public.subscribers FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
