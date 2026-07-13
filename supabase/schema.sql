-- ============================================================================
--  Dania Real Estate — Supabase database for the CMS dashboard
--  Run this ONCE in your Supabase project: Dashboard → SQL Editor → New query
--  → paste all of this → Run. It is idempotent (safe to run again).
-- ============================================================================

-- 1. Extensions --------------------------------------------------------------
create extension if not exists pgcrypto;      -- gen_random_uuid(), crypt(), gen_salt()

-- 2. Tables ------------------------------------------------------------------

-- The whole content-overrides object (SEO, text, contact, images) as one JSON
-- row. A single-row table keeps reads/writes trivial and atomic.
create table if not exists public.site_content (
  id          integer primary key default 1,
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

-- Contact-form submissions (the dashboard "Messages" inbox).
create table if not exists public.messages (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null default '',
  phone       text        not null default '',
  email       text        not null default '',
  type        text        not null default '',
  area        text        not null default '',
  message     text        not null default '',
  read        boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- Keep site_content.updated_at fresh on every write.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_content_touch on public.site_content;
create trigger trg_site_content_touch
  before update on public.site_content
  for each row execute function public.touch_updated_at();

-- Seed the single content row so the first UPDATE/upsert always has a target.
insert into public.site_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- 3. Row Level Security (the important part) ---------------------------------
--    Every account you create is an admin, so "authenticated" == admin here.
alter table public.site_content enable row level security;
alter table public.messages     enable row level security;

-- site_content: the public website may READ published content (needed so the
-- live site renders your edits); only signed-in admins may WRITE.
drop policy if exists "site_content read"  on public.site_content;
create policy "site_content read"
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists "site_content write" on public.site_content;
create policy "site_content write"
  on public.site_content for all
  to authenticated
  using (true) with check (true);

-- messages: anyone may SUBMIT the contact form (insert); only signed-in admins
-- may READ / mark-read / delete. Visitors can never read each other's messages.
drop policy if exists "messages insert" on public.messages;
create policy "messages insert"
  on public.messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "messages read"   on public.messages;
create policy "messages read"
  on public.messages for select
  to authenticated
  using (true);

drop policy if exists "messages update" on public.messages;
create policy "messages update"
  on public.messages for update
  to authenticated
  using (true) with check (true);

drop policy if exists "messages delete" on public.messages;
create policy "messages delete"
  on public.messages for delete
  to authenticated
  using (true);

-- 4. Default admin login -----------------------------------------------------
--    Seeds fivenodes@gmail.com / fivendes2026@ so you can sign in the first
--    time. Passwords are bcrypt-hashed by Supabase (never stored in plain text).
--
--    ⭐ RECOMMENDED (most reliable): instead of the block below, create the user
--    in the Dashboard → Authentication → Users → "Add user":
--        email:    fivenodes@gmail.com
--        password: fivendes2026@
--        ✔ Auto Confirm User
--    Then change the password from the CMS dashboard after your first login.
--
--    The SQL seed is provided as an alternative. If it errors on your Supabase
--    version, use the Dashboard method above instead.
do $$
declare
  uid uuid := gen_random_uuid();
begin
  if not exists (select 1 from auth.users where email = 'fivenodes@gmail.com') then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      'fivenodes@gmail.com', crypt('fivendes2026@', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );
    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid, uid::text,
      json_build_object('sub', uid::text, 'email', 'fivenodes@gmail.com'),
      'email', now(), now(), now()
    );
  end if;
end
$$;

-- Done. Next: copy your Project URL + anon key into Vercel env vars, then
-- activate the Supabase store in the app. See supabase/README.md.
