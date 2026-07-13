# Connecting the CMS to Supabase

The app runs today with a **browser-local** store (localStorage) — no database
needed, works on Vercel as-is. Everything below is for **later**, when you want
edits and messages to be real, shared, and permanent. Nothing here is active
until you follow the "Activate" steps, so you can push and deploy now safely.

---

## What you get with Supabase

| | Local (now) | Supabase (later) |
|---|---|---|
| Content edits | only in your browser | live for **all** visitors |
| Contact messages | only your browser | captured from **every** visitor |
| Admin login | localStorage (not secure) | real **Supabase Auth** (bcrypt, JWT) |
| Security | none | **Row Level Security** on every table |

Default login is seeded either way: **fivenodes@gmail.com / fivendes2026@**.

---

## Step 1 — Create the database

1. Create a project at <https://supabase.com> (free tier is fine).
2. Open **SQL Editor → New query**, paste all of [`schema.sql`](./schema.sql), **Run**.
   - This creates the `site_content` and `messages` tables, locks them down with
     Row Level Security, and seeds the default admin login.

## Step 2 — Make sure the admin login exists

The SQL tries to seed `fivenodes@gmail.com`. If it reported an error on the auth
block (varies by Supabase version), create it manually — **most reliable**:

- **Authentication → Users → Add user**
  - Email: `fivenodes@gmail.com`
  - Password: `fivendes2026@`
  - ✔ **Auto Confirm User**

(You can change this password later from the CMS dashboard.)

## Step 3 — Get your keys

**Project Settings → API**, copy:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

The anon key is meant to be public — RLS is what protects your data. **Never**
use the `service_role` key in the frontend.

## Step 4 — Set the environment variables

**Locally:** copy `.env.example` to `.env.local` and fill in the two values.

**On Vercel:** Project → **Settings → Environment Variables**, add both
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for **Production, Preview,
and Development**, then redeploy.

## Step 5 — Activate the code

```bash
npm install @supabase/supabase-js
```

Then flip the two seams:

1. **Data store** — rename `src/cms/store.supabase.ts.template` →
   `src/cms/store.supabase.ts`, and in `src/cms/store.ts` change the last line to:
   ```ts
   export { supabaseStore as store } from './store.supabase'
   ```

2. **Login (optional but recommended for real security)** — rename
   `src/cms/auth.supabase.ts.template` → `src/cms/auth.supabase.ts` and follow
   the async-switch note at the bottom of that file (point `DashboardPage`'s auth
   imports at it and gate on the session). If you skip this, login stays on the
   local placeholder while content/messages already run on Supabase.

Commit, push, redeploy. Done — the dashboard now reads/writes the real database.

---

## Security summary (what RLS enforces)

- **Public visitors** can: read published site content, submit the contact form.
- **Public visitors** cannot: read anyone's messages, or change any content.
- **Signed-in admins** can: edit all content, read/manage all messages.
- Passwords are hashed by Supabase; the app never sees or stores them.
- Only the **service_role** key can create/delete admin accounts — keep it server
  side (Supabase Dashboard or an Edge Function). See the skeleton in
  `auth.supabase.ts.template`.

## Rolling back

To return to the local store, just revert the last line of `src/cms/store.ts`
to `export const store: CmsStore = localStore`. No data is lost locally.
