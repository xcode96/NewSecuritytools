-- Run this script in your Supabase SQL Editor to allow the "Enterprise Platforms" category.

-- 1. Attempt to drop the existing constraint (assuming standard naming 'books_category_check')
ALTER TABLE public.books DROP CONSTRAINT IF EXISTS books_category_check;

-- 2. Add the updated constraint including 'Enterprise Platforms'
ALTER TABLE public.books ADD CONSTRAINT books_category_check 
CHECK (category IN ('Red Team', 'Blue Team', 'General', 'Enterprise Platforms'));

-- Note: If your constraint has a different name, you may need to find it first using:
-- SELECT constraint_name FROM information_schema.check_constraints WHERE constraint_schema = 'public';
