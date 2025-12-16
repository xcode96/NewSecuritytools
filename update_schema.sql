-- 1. Platforms Table Updates
ALTER TABLE public.platforms 
ADD COLUMN IF NOT EXISTS rating numeric,
ADD COLUMN IF NOT EXISTS founded text,
ADD COLUMN IF NOT EXISTS hackers text,
ADD COLUMN IF NOT EXISTS notable_companies text[];

-- 2. Downloads Table Updates
ALTER TABLE public.downloads
ADD COLUMN IF NOT EXISTS code text,
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS team text,
ADD COLUMN IF NOT EXISTS popularity numeric,
ADD COLUMN IF NOT EXISTS key_features text[];

-- 3. Useful Links Table Updates
ALTER TABLE public.useful_links
ADD COLUMN IF NOT EXISTS icon text,
ADD COLUMN IF NOT EXISTS icon_name text;

-- 4. Breach Services Table Updates
ALTER TABLE public.breach_services
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS key_features text[];
