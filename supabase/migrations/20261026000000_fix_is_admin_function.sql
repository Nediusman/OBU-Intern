-- Fix is_admin() function to allow all active administrator accounts (including Content Admin, Editor, etc.)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
    AND u.is_active = true
  );
$function$;
