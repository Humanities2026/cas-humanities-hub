-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- This creates the single table that stores all app data

create table if not exists app_data (
  key   text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Allow anyone to read and write (the app has no user auth — the HOD password protects admin)
alter table app_data enable row level security;

create policy "allow_all" on app_data
  for all
  using (true)
  with check (true);
