-- =============================================
--  Widespread Blogs — Complete Supabase Schema
--  v2: Admin panel, user flags, dynamic categories
--  Run this FRESH in the Supabase SQL Editor
-- =============================================

-- 0. Clean up (run only if starting fresh)
drop table if exists public.blogs cascade;
drop table if exists public.profiles cascade;
drop table if exists public.categories cascade;
drop type  if exists public.blog_category cascade;

-- 1. Extensions
create extension if not exists "uuid-ossp";

-- =============================================
--  TABLES
-- =============================================

-- 2. Categories (dynamic — admin can add more)
create table public.categories (
  id          uuid default uuid_generate_v4() primary key,
  slug        text unique not null,           -- e.g. "astronomy"
  label       text not null,                  -- e.g. "Astronomy"
  description text not null default '',
  icon        text not null default '📝',
  hero_image  text not null default 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
  gradient    text not null default 'from-gray-500 to-gray-700',  -- Tailwind classes
  sort_order  int  not null default 0,
  created_at  timestamptz default now() not null
);

-- 3. User profiles (extends auth.users)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  email       text not null,
  -- Admin
  is_admin    boolean not null default false,
  -- Moderation
  is_flagged  boolean not null default false,
  flag_reason text,
  is_banned   boolean not null default false,
  ban_reason  text,
  -- Timestamps
  created_at  timestamptz default now() not null
);

-- 4. Blogs
create table public.blogs (
  id          uuid default uuid_generate_v4() primary key,
  title       text not null,
  author_name text not null,
  image_url   text not null,
  content     text not null,
  category    text not null references public.categories(slug) on update cascade,
  user_id     uuid references auth.users(id) on delete cascade not null,
  -- Moderation
  is_flagged  boolean not null default false,
  flag_reason text,
  -- Timestamps
  created_at  timestamptz default now() not null
);

-- =============================================
--  ROW LEVEL SECURITY
-- =============================================

alter table public.categories enable row level security;
alter table public.profiles   enable row level security;
alter table public.blogs       enable row level security;

-- Helper: is current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Helper: is current user banned?
create or replace function public.is_banned()
returns boolean language sql security definer stable as $$
  select coalesce(
    (select is_banned from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Categories policies
create policy "categories_public_read"
  on public.categories for select using (true);

create policy "categories_admin_all"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Profiles policies
create policy "profiles_public_read"
  on public.profiles for select using (true);

create policy "profiles_own_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_admin());

-- Blogs policies
create policy "blogs_public_read"
  on public.blogs for select using (true);

create policy "blogs_insert_authenticated"
  on public.blogs for insert
  with check (
    auth.role() = 'authenticated'
    and auth.uid() = user_id
    and not public.is_banned()
  );

create policy "blogs_own_update"
  on public.blogs for update
  using (auth.uid() = user_id and not public.is_banned())
  with check (auth.uid() = user_id);

create policy "blogs_own_delete"
  on public.blogs for delete
  using (auth.uid() = user_id);

create policy "blogs_admin_all"
  on public.blogs for all
  using (public.is_admin());

-- =============================================
--  AUTO-CREATE PROFILE ON SIGNUP
-- =============================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
--  INDEXES
-- =============================================

create index if not exists blogs_category_idx    on public.blogs (category);
create index if not exists blogs_created_at_idx  on public.blogs (created_at desc);
create index if not exists blogs_user_id_idx     on public.blogs (user_id);
create index if not exists blogs_is_flagged_idx  on public.blogs (is_flagged);
create index if not exists profiles_is_admin_idx on public.profiles (is_admin);

-- =============================================
--  SEED DEFAULT CATEGORIES
-- =============================================

insert into public.categories (slug, label, description, icon, hero_image, gradient, sort_order) values
  ('astronomy',  'Astronomy',             'Explore the cosmos — stars, galaxies, black holes, and everything beyond our world.',                         '🔭', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80', 'from-indigo-500 to-purple-600', 1),
  ('nature',     'Nature',                'Discover the breathtaking wonders of the natural world around us.',                                           '🌿', 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80', 'from-green-500 to-teal-600',   2),
  ('science',    'Science',               'Dive deep into scientific discoveries, experiments, and breakthroughs.',                                      '🔬', 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&q=80', 'from-blue-500 to-cyan-600',    3),
  ('fictional',  'Fictional Imagination', 'Unleash your creativity — stories, worlds, and characters born from imagination.',                           '✨', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=80', 'from-purple-500 to-pink-600',  4)
on conflict (slug) do nothing;

-- =============================================
--  MAKE YOURSELF ADMIN
--  Run this AFTER signing up with your account.
--  Replace the email with yours.
-- =============================================

-- update public.profiles
-- set is_admin = true
-- where email = 'YOUR_ADMIN_EMAIL@example.com';
