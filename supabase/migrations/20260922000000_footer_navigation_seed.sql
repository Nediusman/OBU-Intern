-- Migration: Seed footer navigation items to match the reference design
-- Adds 4 columns: ESSENTIALS, ABOUT US, RESOURCES, QUICK LINKS

-- Clean up any existing footer items to avoid duplicates
DELETE FROM navigation_items WHERE menu = 'footer';

-- Use a CTE approach to insert parents first, then children referencing their parent IDs
DO $$
DECLARE
  essentials_id UUID := gen_random_uuid();
  aboutus_id    UUID := gen_random_uuid();
  resources_id  UUID := gen_random_uuid();
  quicklinks_id UUID := gen_random_uuid();
BEGIN

  -- ─── COLUMN 1: ESSENTIALS ────────────────────────────────────────────────
  INSERT INTO navigation_items (id, menu, label, url, page_id, parent_id, display_order, status)
  VALUES (essentials_id, 'footer', 'ESSENTIALS', NULL, NULL, NULL, 1, 'active');

  INSERT INTO navigation_items (id, menu, label, url, page_id, parent_id, display_order, status) VALUES
    (gen_random_uuid(), 'footer', 'Contact Us',         '/contact',  NULL, essentials_id, 1, 'active'),
    (gen_random_uuid(), 'footer', 'Media Gallery',      '/galleries', NULL, essentials_id, 2, 'active'),
    (gen_random_uuid(), 'footer', 'Emergency Services', '/services', NULL, essentials_id, 3, 'active'),
    (gen_random_uuid(), 'footer', 'Archive',            '/news',     NULL, essentials_id, 4, 'active');

  -- ─── COLUMN 2: ABOUT US ──────────────────────────────────────────────────
  INSERT INTO navigation_items (id, menu, label, url, page_id, parent_id, display_order, status)
  VALUES (aboutus_id, 'footer', 'ABOUT US', NULL, NULL, NULL, 2, 'active');

  INSERT INTO navigation_items (id, menu, label, url, page_id, parent_id, display_order, status) VALUES
    (gen_random_uuid(), 'footer', 'History',    '/about',                   NULL, aboutus_id, 1, 'active'),
    (gen_random_uuid(), 'footer', 'Leadership', '/leadership',              NULL, aboutus_id, 2, 'active'),
    (gen_random_uuid(), 'footer', 'Presidents', '/about/president-message', NULL, aboutus_id, 3, 'active'),
    (gen_random_uuid(), 'footer', 'Overview',   '/about',                   NULL, aboutus_id, 4, 'active');

  -- ─── COLUMN 3: RESOURCES ─────────────────────────────────────────────────
  INSERT INTO navigation_items (id, menu, label, url, page_id, parent_id, display_order, status)
  VALUES (resources_id, 'footer', 'RESOURCES', NULL, NULL, NULL, 3, 'active');

  INSERT INTO navigation_items (id, menu, label, url, page_id, parent_id, display_order, status) VALUES
    (gen_random_uuid(), 'footer', 'Events',          '/events',              NULL, resources_id, 1, 'active'),
    (gen_random_uuid(), 'footer', 'Documents',        '/registrar/documents', NULL, resources_id, 2, 'active'),
    (gen_random_uuid(), 'footer', 'Publications',     '/research',            NULL, resources_id, 3, 'active'),
    (gen_random_uuid(), 'footer', 'Services',         '/services',            NULL, resources_id, 4, 'active'),
    (gen_random_uuid(), 'footer', 'Programs A to Z',  '/academics/programs',  NULL, resources_id, 5, 'active'),
    (gen_random_uuid(), 'footer', 'Privacy Policy',   '/privacy-policy',      NULL, resources_id, 6, 'active');

  -- ─── COLUMN 4: QUICK LINKS ───────────────────────────────────────────────
  INSERT INTO navigation_items (id, menu, label, url, page_id, parent_id, display_order, status)
  VALUES (quicklinks_id, 'footer', 'QUICK LINKS', NULL, NULL, NULL, 4, 'active');

  INSERT INTO navigation_items (id, menu, label, url, page_id, parent_id, display_order, status) VALUES
    (gen_random_uuid(), 'footer', 'Staff & Admin Portal', '/admin',                       NULL, quicklinks_id, 1, 'active'),
    (gen_random_uuid(), 'footer', 'Portal',               'https://portal.obu.edu.et',    NULL, quicklinks_id, 2, 'active'),
    (gen_random_uuid(), 'footer', 'E-Learning',           'https://elearning.obu.edu.et', NULL, quicklinks_id, 3, 'active'),
    (gen_random_uuid(), 'footer', 'Campus Life',          '/about',                       NULL, quicklinks_id, 4, 'active'),
    (gen_random_uuid(), 'footer', 'LMS Platform',         'https://lms.obu.edu.et',       NULL, quicklinks_id, 5, 'active');

END $$;
