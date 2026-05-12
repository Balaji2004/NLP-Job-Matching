-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Creates the resume_history table with RLS enabled

create table if not exists public.resume_history (
  id               uuid primary key default gen_random_uuid(),
  email            text not null,
  match_percentage integer not null,
  matching_skills  text[]  default '{}',
  missing_skills   text[]  default '{}',
  predicted_role   text,
  technical_score  integer default 0,
  soft_score       integer default 0,
  suggestions      text[]  default '{}',
  job_description  text,
  created_at       timestamptz default now()
);

-- Index for fast user lookups
create index if not exists resume_history_email_idx
  on public.resume_history (email, created_at desc);

-- Enable Row Level Security
alter table public.resume_history enable row level security;

-- RLS policy: users can only read their own rows
-- NOTE: The backend uses the service role key which bypasses RLS.
--       This policy protects direct Supabase client access.
create policy "Users can read own history"
  on public.resume_history
  for select
  using (auth.jwt() ->> 'email' = email);

-- Allow service role unrestricted access (used by backend)
-- This is the default behavior when using the service role key.
