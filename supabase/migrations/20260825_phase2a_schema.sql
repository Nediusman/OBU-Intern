-- Phase 2A Migration: Add slug columns to dynamic route entities

-- 1. Add slug columns
ALTER TABLE public.galleries ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.leadership ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.academic_units ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.administrative_offices ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Create slugification helper function
CREATE OR REPLACE FUNCTION public.generate_slug(base_text TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
BEGIN
    -- Lowercase, replace non-alphanumeric with hyphens, trim hyphens
    base_slug := lower(regexp_replace(base_text, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);

    IF base_slug IS NULL OR base_slug = '' THEN
        base_slug := 'item';
    END IF;

    RETURN base_slug;
END;
$$ LANGUAGE plpgsql;

-- 3. Backfill existing data
-- galleries (title)
UPDATE public.galleries g SET slug = CASE
    WHEN (SELECT count(*) FROM public.galleries g2 WHERE public.generate_slug(g2.title) = public.generate_slug(g.title)) > 1
    THEN public.generate_slug(g.title) || '-' || substr(g.id::text, 1, 8)
    ELSE public.generate_slug(g.title)
END WHERE slug IS NULL;

-- leadership (full_name)
UPDATE public.leadership l SET slug = CASE
    WHEN (SELECT count(*) FROM public.leadership l2 WHERE public.generate_slug(l2.full_name) = public.generate_slug(l.full_name)) > 1
    THEN public.generate_slug(l.full_name) || '-' || substr(l.id::text, 1, 8)
    ELSE public.generate_slug(l.full_name)
END WHERE slug IS NULL;

-- services (service_name)
UPDATE public.services s SET slug = CASE
    WHEN (SELECT count(*) FROM public.services s2 WHERE public.generate_slug(s2.service_name) = public.generate_slug(s.service_name)) > 1
    THEN public.generate_slug(s.service_name) || '-' || substr(s.id::text, 1, 8)
    ELSE public.generate_slug(s.service_name)
END WHERE slug IS NULL;

-- academic_units (name)
UPDATE public.academic_units a SET slug = CASE
    WHEN (SELECT count(*) FROM public.academic_units a2 WHERE public.generate_slug(a2.name) = public.generate_slug(a.name)) > 1
    THEN public.generate_slug(a.name) || '-' || substr(a.id::text, 1, 8)
    ELSE public.generate_slug(a.name)
END WHERE slug IS NULL;

-- programs (name)
UPDATE public.programs p SET slug = CASE
    WHEN (SELECT count(*) FROM public.programs p2 WHERE public.generate_slug(p2.name) = public.generate_slug(p.name)) > 1
    THEN public.generate_slug(p.name) || '-' || substr(p.id::text, 1, 8)
    ELSE public.generate_slug(p.name)
END WHERE slug IS NULL;

-- administrative_offices (office_name)
UPDATE public.administrative_offices ao SET slug = CASE
    WHEN (SELECT count(*) FROM public.administrative_offices ao2 WHERE public.generate_slug(ao2.office_name) = public.generate_slug(ao.office_name)) > 1
    THEN public.generate_slug(ao.office_name) || '-' || substr(ao.id::text, 1, 8)
    ELSE public.generate_slug(ao.office_name)
END WHERE slug IS NULL;

-- 4. Add UNIQUE constraints
ALTER TABLE public.galleries DROP CONSTRAINT IF EXISTS galleries_slug_key;
ALTER TABLE public.galleries ADD CONSTRAINT galleries_slug_key UNIQUE (slug);

ALTER TABLE public.leadership DROP CONSTRAINT IF EXISTS leadership_slug_key;
ALTER TABLE public.leadership ADD CONSTRAINT leadership_slug_key UNIQUE (slug);

ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_slug_key;
ALTER TABLE public.services ADD CONSTRAINT services_slug_key UNIQUE (slug);

ALTER TABLE public.academic_units DROP CONSTRAINT IF EXISTS academic_units_slug_key;
ALTER TABLE public.academic_units ADD CONSTRAINT academic_units_slug_key UNIQUE (slug);

ALTER TABLE public.programs DROP CONSTRAINT IF EXISTS programs_slug_key;
ALTER TABLE public.programs ADD CONSTRAINT programs_slug_key UNIQUE (slug);

ALTER TABLE public.administrative_offices DROP CONSTRAINT IF EXISTS administrative_offices_slug_key;
ALTER TABLE public.administrative_offices ADD CONSTRAINT administrative_offices_slug_key UNIQUE (slug);

-- Drop the helper function
DROP FUNCTION public.generate_slug(TEXT);