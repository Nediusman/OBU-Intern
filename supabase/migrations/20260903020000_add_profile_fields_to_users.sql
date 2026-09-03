-- Add phone and profile_image_id to public.users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS profile_image_id UUID NULL REFERENCES public.media(id) ON DELETE SET NULL;

-- Enable RLS and add self-update policy
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
    ON public.users
    FOR UPDATE
    TO public
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
  END IF;
END $$;
