-- ScamShield Supabase Database Schema (SAFE + RERUNNABLE)

-- ==========================================
-- EXTENSIONS
-- ==========================================
create extension if not exists "uuid-ossp";

-- ==========================================
-- TABLE: user_profiles
-- ==========================================
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- TABLE: scan_history
-- ==========================================
create table if not exists public.scan_history (
  id uuid primary key default uuid_generate_v4(),

  user_id uuid not null references public.user_profiles(id) on delete cascade,

  text text not null,

  risk_level text not null check (
    risk_level in ('safe','suspicious','high-risk','likely-scam')
  ),

  risk_score integer not null check (
    risk_score >= 0 and risk_score <= 100
  ),

  scam_type text default 'unknown' check (
    scam_type in (
      'phishing',
      'fake-job',
      'loan-scam',
      'bank-fraud',
      'investment-scam',
      'otp-theft',
      'romance-scam',
      'lottery-scam',
      'tech-support',
      'unknown'
    )
  ),

  red_flags text[] default '{}',
  recommendations text[] default '{}',
  detected_languages text[] default '{}',

  confidence integer not null default 50 check (
    confidence >= 0 and confidence <= 100
  ),

  sender_email text,
  subject text,

  created_at timestamptz default now()
);

-- ==========================================
-- INDEXES
-- ==========================================
create index if not exists idx_scan_history_user_id
on public.scan_history(user_id);

create index if not exists idx_scan_history_created_at
on public.scan_history(created_at desc);

create index if not exists idx_scan_history_risk_level
on public.scan_history(risk_level);

-- ==========================================
-- ENABLE RLS
-- ==========================================
alter table public.user_profiles enable row level security;
alter table public.scan_history enable row level security;

-- ==========================================
-- DROP OLD POLICIES IF EXISTS
-- ==========================================
drop policy if exists "Users can view own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;

drop policy if exists "Users can view own scan history" on public.scan_history;
drop policy if exists "Users can insert own scan history" on public.scan_history;
drop policy if exists "Users can update own scan history" on public.scan_history;
drop policy if exists "Users can delete own scan history" on public.scan_history;

-- ==========================================
-- CREATE POLICIES: user_profiles
-- ==========================================
create policy "Users can view own profile"
on public.user_profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.user_profiles
for update
using (auth.uid() = id);

-- ==========================================
-- CREATE POLICIES: scan_history
-- ==========================================
create policy "Users can view own scan history"
on public.scan_history
for select
using (auth.uid() = user_id);

create policy "Users can insert own scan history"
on public.scan_history
for insert
with check (auth.uid() = user_id);

create policy "Users can update own scan history"
on public.scan_history
for update
using (auth.uid() = user_id);

create policy "Users can delete own scan history"
on public.scan_history
for delete
using (auth.uid() = user_id);

-- ==========================================
-- FUNCTION: auto create profile after signup
-- ==========================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- ==========================================
-- DROP + RECREATE TRIGGER SAFELY
-- ==========================================
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ==========================================
-- FUNCTION: update updated_at timestamp
-- ==========================================
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ==========================================
-- DROP + RECREATE TRIGGER
-- ==========================================
drop trigger if exists update_user_profiles_updated_at
on public.user_profiles;

create trigger update_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.update_updated_at_column();
