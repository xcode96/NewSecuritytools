-- Run this in Supabase SQL Editor to enable reordering

-- Add sort_order column
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order bigint DEFAULT 0;

-- Initialize sort_order (optional simple seed)
-- Update existing rows to have distinct sort_order if they are all 0
DO $$
DECLARE
    r RECORD;
    i INTEGER := 1;
BEGIN
    FOR r IN SELECT id FROM public.categories ORDER BY name LOOP
        UPDATE public.categories SET sort_order = i WHERE id = r.id;
        i := i + 1;
    END LOOP;
END $$;
