-- Phase 2B Migration: Enable RLS and add policies for public pages and academic data

-- 1. Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (Idempotency)
DROP POLICY IF EXISTS "Public read active pages" ON public.pages;
DROP POLICY IF EXISTS "Admin write pages" ON public.pages;

DROP POLICY IF EXISTS "Public read active units" ON public.academic_units;
DROP POLICY IF EXISTS "Admin write units" ON public.academic_units;

DROP POLICY IF EXISTS "Public read active programs" ON public.programs;
DROP POLICY IF EXISTS "Admin write programs" ON public.programs;

-- 3. Create public SELECT policies
-- Pages uses 'published' status
CREATE POLICY "Public read active pages" ON public.pages 
  FOR SELECT USING (status = 'published');

-- Academic Units uses 'active' status
CREATE POLICY "Public read active units" ON public.academic_units 
  FOR SELECT USING (status = 'active');

-- Programs uses 'active' status
CREATE POLICY "Public read active programs" ON public.programs 
  FOR SELECT USING (status = 'active');

-- 4. Create admin ALL policies
CREATE POLICY "Admin write pages" ON public.pages 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admin write units" ON public.academic_units 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admin write programs" ON public.programs 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()));
