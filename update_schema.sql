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
-- 11. Admin Users Table
create table if not exists public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Admin Users
alter table public.admin_users enable row level security;
create policy "Allow read for authenticated users" on public.admin_users for select using (auth.uid() = user_id);
-- We might want a policy that allows the service role (for scripts) to insert, 
-- but generally manual insertion or valid RLS setup is needed. 
-- For now, we'll rely on service_role key for the registration script.
