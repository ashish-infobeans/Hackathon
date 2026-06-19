-- Core schema for hackathon project signups (no RLS in this migration).

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  client_id uuid not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_description text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.signups (
  participant_id uuid not null references public.participants (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (participant_id)
);

create index if not exists signups_project_id_idx on public.signups (project_id);
