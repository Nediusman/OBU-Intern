-- Create the 'media' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Idempotency: Drop policies if they already exist
DROP POLICY IF EXISTS "Public media read access" ON storage.objects;
DROP POLICY IF EXISTS "Admin media upload access" ON storage.objects;
DROP POLICY IF EXISTS "Admin media update access" ON storage.objects;
DROP POLICY IF EXISTS "Admin media delete access" ON storage.objects;

-- 1. Public can read media files
CREATE POLICY "Public media read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- 2. Authorized admins can insert/upload media files
CREATE POLICY "Admin media upload access" ON storage.objects
  FOR INSERT TO authenticated 
  WITH CHECK (
    bucket_id = 'media' 
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
  );

-- 3. Authorized admins can update media files
CREATE POLICY "Admin media update access" ON storage.objects
  FOR UPDATE TO authenticated 
  USING (
    bucket_id = 'media' 
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
  );

-- 4. Authorized admins can delete media files
CREATE POLICY "Admin media delete access" ON storage.objects
  FOR DELETE TO authenticated 
  USING (
    bucket_id = 'media' 
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
  );
