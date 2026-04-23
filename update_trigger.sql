-- Run this in your Supabase SQL Editor to update the signup trigger
-- It will read the requested role from the user's signup metadata

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role TEXT;
BEGIN
  -- Read the role passed from the signup form
  requested_role := new.raw_user_meta_data->>'role';
  
  -- Fallback to 'viewer' if not provided or invalid
  IF requested_role IS NULL OR requested_role NOT IN ('admin', 'author', 'viewer') THEN
    requested_role := 'viewer';
  END IF;

  INSERT INTO public.user_roles (id, role)
  VALUES (new.id, requested_role);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
