-- Add main_image_id to announcements table
ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS main_image_id UUID NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'announcements_main_image_id_fkey'
  ) THEN
    ALTER TABLE public.announcements
    ADD CONSTRAINT announcements_main_image_id_fkey
    FOREIGN KEY (main_image_id)
    REFERENCES public.media(id)
    ON DELETE SET NULL;
  END IF;
END $$;
