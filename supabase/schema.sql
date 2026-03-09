create extension if not exists pgcrypto;

create table if not exists intro_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  updated_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  sort_order int unique not null,
  axis text not null check (axis in ('EI', 'SN', 'TF', 'JP')),
  emoji text not null,
  text text not null,
  a_label text not null,
  a_value text not null check (a_value in ('E', 'I', 'S', 'N', 'T', 'F', 'J', 'P')),
  b_label text not null,
  b_value text not null check (b_value in ('E', 'I', 'S', 'N', 'T', 'F', 'J', 'P')),
  updated_at timestamptz default now()
);

create table if not exists result_types (
  id uuid primary key default gen_random_uuid(),
  mbti_code text unique not null check (length(mbti_code) = 4),
  emoji text not null,
  title text not null,
  sub text not null,
  description text not null,
  hashtags text not null,
  updated_at timestamptz default now()
);

create table if not exists growth_tips (
  id uuid primary key default gen_random_uuid(),
  direction text unique not null,
  icon text not null,
  title text not null,
  tips text not null,
  updated_at timestamptz default now()
);

create table if not exists test_logs (
  id uuid primary key default gen_random_uuid(),
  actual_mbti text not null,
  chugumi_mbti text not null,
  created_at timestamptz default now()
);

alter table intro_content enable row level security;
alter table questions enable row level security;
alter table result_types enable row level security;
alter table growth_tips enable row level security;
alter table test_logs enable row level security;

drop policy if exists public_read_intro_content on intro_content;
create policy public_read_intro_content on intro_content for select using (true);
drop policy if exists admin_write_intro_content on intro_content;
create policy admin_write_intro_content on intro_content for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists public_read_questions on questions;
create policy public_read_questions on questions for select using (true);
drop policy if exists admin_write_questions on questions;
create policy admin_write_questions on questions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists public_read_result_types on result_types;
create policy public_read_result_types on result_types for select using (true);
drop policy if exists admin_write_result_types on result_types;
create policy admin_write_result_types on result_types for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists public_read_growth_tips on growth_tips;
create policy public_read_growth_tips on growth_tips for select using (true);
drop policy if exists admin_write_growth_tips on growth_tips;
create policy admin_write_growth_tips on growth_tips for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists public_insert_test_logs on test_logs;
create policy public_insert_test_logs on test_logs for insert with check (true);
drop policy if exists admin_read_test_logs on test_logs;
create policy admin_read_test_logs on test_logs for select using (auth.role() = 'authenticated');
