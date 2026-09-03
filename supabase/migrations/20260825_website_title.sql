-- Add website_title to public.website_settings
ALTER TABLE public.website_settings
ADD COLUMN IF NOT EXISTS website_title VARCHAR(255);
