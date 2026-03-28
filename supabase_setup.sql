-- ══════════════════════════════════════════════════════════════════
--  CAS Humanities Training Hub — Supabase Setup
--  Run this in: Dashboard → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════════

-- ── 1. TEACHERS ───────────────────────────────────────────────────
create table if not exists teachers (
  id          text primary key,
  name        text not null,
  email       text not null,
  subject     text,
  role        text default 'New Joiner',
  joined      text,
  courses     jsonb default '[]'::jsonb,
  progress    jsonb default '{}'::jsonb,
  updated_at  timestamptz default now()
);

alter table teachers enable row level security;

create policy "allow_all_teachers" on teachers
  for all using (true) with check (true);

-- ── 2. COURSES ────────────────────────────────────────────────────
create table if not exists courses (
  id          text primary key,
  name        text not null,
  icon        text default '📚',
  description text,
  updated_at  timestamptz default now()
);

alter table courses enable row level security;

create policy "allow_all_courses" on courses
  for all using (true) with check (true);

-- ── 3. REFLECTIONS ────────────────────────────────────────────────
create table if not exists reflections (
  id           uuid primary key default gen_random_uuid(),
  teacher_id   text not null,
  lesson_id    text not null,
  lesson_title text,
  question     text,
  answer       text,
  timestamp    timestamptz default now()
);

alter table reflections enable row level security;

create policy "allow_all_reflections" on reflections
  for all using (true) with check (true);

-- ══════════════════════════════════════════════════════════════════
--  OPTIONAL: seed default courses so the app has data on first load.
--  Skip this block if you want to add courses via the Admin panel.
-- ══════════════════════════════════════════════════════════════════
insert into courses (id, name, icon, description) values
  ('c1', 'Economics',            '📈', 'College-level economics with C3 inquiry focus'),
  ('c2', 'History',              '⏳', 'Historical thinking, sources, and argumentation'),
  ('c3', 'Geography',            '🌍', 'Spatial thinking and human-environment interaction'),
  ('c4', 'Civics',               '⚖️', 'Rights, power, participation, and democratic institutions'),
  ('c5', 'Sociology',            '🏘️', 'Human behaviour, society, culture, and identity'),
  ('c6', 'Business and Marketing','💼', 'Business concepts, strategy, and marketing inquiry')
on conflict (id) do nothing;

-- ══════════════════════════════════════════════════════════════════
--  OPTIONAL: seed default teachers.
--  Skip this block if you want to add teachers via the Admin panel.
-- ══════════════════════════════════════════════════════════════════
insert into teachers (id, name, email, subject, role, joined, courses, progress) values
  ('t1', 'Mr. Osama',      'usama.barrak@cityamericanschool.ae', 'Economics', 'Current',    'Aug 2023', '["c1"]'::jsonb, '{"m1":3,"m2":6,"m3":3,"m4":3,"m5":3}'::jsonb),
  ('t2', 'Mr. Mo',         'm.mousa@cityamericanschool.ae',      'History',   'Current',    'Sep 2021', '["c2"]'::jsonb, '{}'::jsonb),
  ('t3', 'Mr. Ajlony',     'muhammad.ahmad@cityamericanschool.ae','Civics',   'New Joiner', 'Jan 2026', '["c4"]'::jsonb, '{}'::jsonb),
  ('t4', 'James Kowalski', 'j.kowalski@cas.ae',                  'Geography', 'Current',   'Aug 2022', '["c3"]'::jsonb, '{}'::jsonb),
  ('t5', 'Ms. Bahija',     'b.hamdi@cityamericanschool.ae',      'Civics',   'New Joiner', 'Jan 2026', '["c4"]'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;
