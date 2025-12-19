-- Add missing columns to the books table
-- This fixes the error: "Could not find the 'pages' column of 'books' in the schema cache"

-- 1. Add 'pages' column if it doesn't exist
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS pages text;

-- 2. Add 'year' column if it doesn't exist (likely missing too if pages is missing)
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS year text;

-- 3. Refresh the schema cache (handled automatically by Supabase usually, but good to know)
NOTIFY pgrst, 'reload config';
