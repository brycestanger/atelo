-- ATELO — Supabase schema. Paste into the Supabase SQL Editor and Run.
-- Safe to re-run (idempotent). See SUPABASE.md for the full setup walkthrough.

-- ---------- Tables ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  studio_name text,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  client_name text,
  slug text not null unique,
  status text not null default 'draft'
    check (status in ('draft','awaiting-client','swiping','synthesizing','ready')),
  created_at timestamptz default now()
);
create index if not exists projects_owner_idx on public.projects(owner);

-- ---------- Plans, credits & due dates (re-runnable) ----------
-- A studio's board allowance. `plan` free|pro (pro = unlimited boards);
-- `credits` is the number of boards a non-pro studio may have at once (starts
-- at 1 — the free board). Buying credits raises it; deleting a board frees a slot.
alter table public.profiles add column if not exists plan text not null default 'free';
alter table public.profiles add column if not exists credits int not null default 1;
do $$ begin
  alter table public.profiles add constraint profiles_plan_chk check (plan in ('free','pro'));
exception when duplicate_object then null; end $$;

-- Optional client deadline for a project.
alter table public.projects add column if not exists due_date date;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  kind text not null default 'photo' check (kind in ('photo','swatch')),
  position int not null default 0
);
create index if not exists categories_project_idx on public.categories(project_id);

-- the swipeable options (a photo or a colour swatch)
create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  title text not null,
  meta text,
  kind text not null default 'photo' check (kind in ('photo','swatch')),
  image_path text,   -- storage object path when kind = 'photo'
  color text,        -- hex when kind = 'swatch'
  position int not null default 0
);
create index if not exists options_category_idx on public.options(category_id);

-- one client run of a board
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- each swipe
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  option_id uuid not null references public.options(id) on delete cascade,
  verdict text not null check (verdict in ('like','pass','pin')),
  created_at timestamptz default now()
);
create index if not exists responses_session_idx on public.responses(session_id);

-- tournament winner per category
create table if not exists public.winners (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  option_id uuid not null references public.options(id) on delete cascade
);

-- ---------- Row Level Security ----------
alter table public.profiles   enable row level security;
alter table public.projects   enable row level security;
alter table public.categories enable row level security;
alter table public.options    enable row level security;
alter table public.sessions   enable row level security;
alter table public.responses  enable row level security;
alter table public.winners    enable row level security;

-- profiles: owner only
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- projects: owner read/write; public read (the shareable link is the capability)
drop policy if exists "owner rw projects" on public.projects;
create policy "owner rw projects" on public.projects
  for all using (auth.uid() = owner) with check (auth.uid() = owner);
drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (true);

-- categories + options: owner read/write via parent project; public read
drop policy if exists "owner rw categories" on public.categories;
create policy "owner rw categories" on public.categories for all
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner = auth.uid()));
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "owner rw options" on public.options;
create policy "owner rw options" on public.options for all
  using (exists (
    select 1 from public.categories c join public.projects p on p.id = c.project_id
    where c.id = category_id and p.owner = auth.uid()))
  with check (exists (
    select 1 from public.categories c join public.projects p on p.id = c.project_id
    where c.id = category_id and p.owner = auth.uid()));
drop policy if exists "public read options" on public.options;
create policy "public read options" on public.options for select using (true);

-- sessions/responses/winners: the unauthenticated client link can insert + read
drop policy if exists "public rw sessions" on public.sessions;
create policy "public rw sessions" on public.sessions for all using (true) with check (true);
drop policy if exists "public rw responses" on public.responses;
create policy "public rw responses" on public.responses for all using (true) with check (true);
drop policy if exists "public rw winners" on public.winners;
create policy "public rw winners" on public.winners for all using (true) with check (true);

-- ---------- Storage: option images ----------
insert into storage.buckets (id, name, public)
values ('options', 'options', true)
on conflict (id) do nothing;

drop policy if exists "public read option images" on storage.objects;
create policy "public read option images" on storage.objects
  for select using (bucket_id = 'options');
drop policy if exists "auth upload option images" on storage.objects;
create policy "auth upload option images" on storage.objects
  for insert to authenticated with check (bucket_id = 'options');

-- ---------- Auto-create a profile on signup ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
