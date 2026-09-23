-- GymRoutineAI schema
-- Run this in the Supabase SQL editor after creating your project.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  fitness_level text not null,
  goal text not null,
  equipment text not null,
  days_per_week integer not null check (days_per_week between 2 and 6),
  target_muscles text[] not null default '{}',
  plan jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists routines_user_id_created_at_idx
  on public.routines (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.routines enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can view own routines" on public.routines;
create policy "Users can view own routines"
  on public.routines for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own routines" on public.routines;
create policy "Users can insert own routines"
  on public.routines for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own routines" on public.routines;
create policy "Users can update own routines"
  on public.routines for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own routines" on public.routines;
create policy "Users can delete own routines"
  on public.routines for delete
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
