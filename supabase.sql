-- Run this in Supabase SQL Editor.
create table if not exists public.confessions (
  id bigint generated always as identity primary key,
  body text not null check (char_length(body) between 5 and 2000),
  status text not null default 'pending' check (status in ('pending','rejected')),
  created_at timestamptz not null default now()
);
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.confessions enable row level security;
alter table public.admin_users enable row level security;

-- Anyone may submit a confession. No public read access is granted.
create policy "Anyone can submit" on public.confessions
  for insert to anon, authenticated with check (status = 'pending');

-- Only a signed-in user explicitly listed as an admin can read/manage submissions.
create policy "Admins can read" on public.confessions
  for select to authenticated using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );
create policy "Admins can update" on public.confessions
  for update to authenticated using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );
create policy "Admins can delete" on public.confessions
  for delete to authenticated using (
    exists (select 1 from public.admin_users a where a.user_id = auth.uid())
  );

-- Admins can only see their own admin-list row; no public access.
create policy "Admins can read own admin row" on public.admin_users
  for select to authenticated using (user_id = auth.uid());
