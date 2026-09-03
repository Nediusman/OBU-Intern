-- Add slug to announcements table
ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Backfill slugs for announcements
DO $$
DECLARE
  rec RECORD;
  base_slug TEXT;
  new_slug TEXT;
  counter INT;
BEGIN
  FOR rec IN SELECT id, title FROM public.announcements WHERE slug IS NULL OR slug = '' LOOP
    base_slug := lower(regexp_replace(COALESCE(rec.title, 'announcement'), '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    IF base_slug = '' THEN
      base_slug := 'announcement';
    END IF;
    
    new_slug := base_slug;
    counter := 1;
    
    WHILE EXISTS (SELECT 1 FROM public.announcements WHERE slug = new_slug AND id != rec.id) LOOP
      counter := counter + 1;
      new_slug := base_slug || '-' || counter;
    END LOOP;
    
    UPDATE public.announcements SET slug = new_slug WHERE id = rec.id;
  END LOOP;
END $$;

-- Add UNIQUE constraint and NOT NULL for announcements.slug
ALTER TABLE public.announcements ALTER COLUMN slug SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'announcements_slug_key'
  ) THEN
    ALTER TABLE public.announcements
    ADD CONSTRAINT announcements_slug_key UNIQUE (slug);
  END IF;
END $$;


-- Add slug to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Backfill slugs for events
DO $$
DECLARE
  rec RECORD;
  base_slug TEXT;
  new_slug TEXT;
  counter INT;
BEGIN
  FOR rec IN SELECT id, title FROM public.events WHERE slug IS NULL OR slug = '' LOOP
    base_slug := lower(regexp_replace(COALESCE(rec.title, 'event'), '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    IF base_slug = '' THEN
      base_slug := 'event';
    END IF;
    
    new_slug := base_slug;
    counter := 1;
    
    WHILE EXISTS (SELECT 1 FROM public.events WHERE slug = new_slug AND id != rec.id) LOOP
      counter := counter + 1;
      new_slug := base_slug || '-' || counter;
    END LOOP;
    
    UPDATE public.events SET slug = new_slug WHERE id = rec.id;
  END LOOP;
END $$;

-- Add UNIQUE constraint and NOT NULL for events.slug
ALTER TABLE public.events ALTER COLUMN slug SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'events_slug_key'
  ) THEN
    ALTER TABLE public.events
    ADD CONSTRAINT events_slug_key UNIQUE (slug);
  END IF;
END $$;
