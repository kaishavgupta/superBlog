-- 1. Add cover image to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- 2. Add author_name to comments so we don't have to join auth.users
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS author_name TEXT;

-- 3. We will also update existing comments to have a default name
UPDATE public.comments SET author_name = 'Anonymous' WHERE author_name IS NULL;

-- 4. Add author_name to posts so readers know who wrote it
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_name TEXT;
UPDATE public.posts SET author_name = 'Anonymous' WHERE author_name IS NULL;
