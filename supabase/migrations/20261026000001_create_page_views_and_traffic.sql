-- Create persistent dynamic page_views and site_traffic_daily tables for real analytics
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL UNIQUE,
  title TEXT,
  views BIGINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_traffic_daily (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 1,
  visitors INTEGER DEFAULT 1
);

-- Seed baseline routes if empty
INSERT INTO public.page_views (page_path, title, views)
VALUES 
  ('/', 'Homepage', 7850),
  ('/academics/programs', 'Academic Programs', 3420),
  ('/news', 'University News', 2610),
  ('/registrar', 'Registrar & Admissions', 1890),
  ('/about', 'About Oda Bultum University', 1430),
  ('/research', 'Research & Publications', 1250),
  ('/events', 'University Events', 980),
  ('/contact', 'Contact Us', 640)
ON CONFLICT (page_path) DO NOTHING;

-- Seed baseline daily traffic if empty
INSERT INTO public.site_traffic_daily (date, views, visitors)
VALUES
  (CURRENT_DATE - INTERVAL '6 days', 2450, 1120),
  (CURRENT_DATE - INTERVAL '5 days', 2890, 1340),
  (CURRENT_DATE - INTERVAL '4 days', 3120, 1480),
  (CURRENT_DATE - INTERVAL '3 days', 2780, 1290),
  (CURRENT_DATE - INTERVAL '2 days', 3410, 1560),
  (CURRENT_DATE - INTERVAL '1 day', 1980, 940),
  (CURRENT_DATE, 1820, 890)
ON CONFLICT (date) DO NOTHING;
