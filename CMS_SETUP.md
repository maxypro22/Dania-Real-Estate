# CMS Setup — Dania Real Estate (`/dashboard`)

A **git-based CMS** (Decap) for this static site. You edit content in the
`/dashboard` panel → it commits to this GitHub repo → Vercel rebuilds → the
change is live for all visitors. No separate database; images and SEO stay
baked into the static build.

> **Security:** a real, publish-to-live CMS **requires a login**. `/dashboard`
> is `noindex` + disallowed in `robots.txt`, and Phase 2 puts it behind GitHub
> auth. Never expose a save-to-live editor without authentication.

---

## Phase 1 — DONE (in this repo)

- **`/dashboard`** panel scaffolded — `public/dashboard/index.html` + `config.yml`.
- **Site Settings** are now editable content: `src/content/settings.json` is the
  single source of truth; `src/data/mockData.ts` exports `company` from it, so
  every page already reads CMS-managed values (logo alt, contact, phones,
  socials, hours, stats).
- Media library folder: `public/uploads/`.

### Edit locally now (no login, no GitHub) — one command
```bash
npm run cms                 # runs Vite + decap-server together
# open http://localhost:5173/dashboard/
```
You'll see two collections:
- **Pages → Home Page → Featured sections** — edit each card's text (EN/AR),
  swap/upload its image, change its link, **drag to reorder**, **add/delete**
  sections, and toggle **Show this section** on/off. Renders from
  `src/content/home.json`.
- **Site Settings → Company & Contact** — contact, phones, socials, hours,
  logo alt, stats. Renders from `src/content/settings.json`.

Edit → **Publish** and `decap-server` writes straight to those files, so the
running site updates immediately. (Two-terminal alternative: `npx decap-server`
+ `npm run dev`.)

---

## Phase 2 — Make it live (login + publish). ~30–45 min, one-time.

**1. Put the repo on GitHub** and connect it to Vercel (if not already), then set
the repo in `public/dashboard/config.yml`:
```yml
backend:
  name: github
  repo: your-github-username/your-repo   # <-- replace OWNER/REPO
  branch: main
```

**2. Create a GitHub OAuth App** (github.com → Settings → Developer settings →
OAuth Apps → New):
- Homepage URL: `https://www.dania-realestate.com`
- Authorization callback URL: `https://<your-oauth-handler>/callback` (from step 3)
- Copy the **Client ID** and **Client Secret**.

**3. Deploy an OAuth handler** (Decap's GitHub backend needs one on Vercel).
Use a maintained one, e.g. `vercel-decap-cms-oauth` / `decap-cms-github-oauth`
(deploy to Vercel, set env vars `OAUTH_GITHUB_CLIENT_ID`,
`OAUTH_GITHUB_CLIENT_SECRET`). Then point the CMS at it in `config.yml`:
```yml
backend:
  name: github
  repo: your-github-username/your-repo
  branch: main
  base_url: https://<your-oauth-handler>      # the deployed handler
  auth_endpoint: /api/auth                     # per the handler's docs
```

**4. Add the `/dashboard` CSP exception** to `vercel.json` (Decap loads from a
CDN and uses `eval`, which the site-wide CSP blocks). Change the site-wide
header source to exclude `/dashboard`, and add a scoped policy:

```jsonc
"headers": [
  {
    "source": "/((?!dashboard).*)",          // was "/(.*)"
    "headers": [ /* keep the existing Cache-Control + 6 security headers, incl. the strict CSP */ ]
  },
  {
    "source": "/dashboard/(.*)",
    "headers": [
      { "key": "X-Robots-Tag", "value": "noindex" },
      { "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https:; font-src 'self' data: https://unpkg.com; connect-src 'self' https://api.github.com https://unpkg.com https://avatars.githubusercontent.com" }
    ]
  },
  { "source": "/assets/(.*)", "headers": [ /* immutable cache */ ] }
]
```
> Keep the strict site-wide CSP first so it stays the policy for every public
> page; only `/dashboard/*` gets the relaxed one.

**5. Deploy.** Visit `https://www.dania-realestate.com/dashboard/`, log in with
GitHub, edit **Site Settings**, click **Publish** → Decap commits →
Vercel redeploys → live.

---

## Roadmap (next collections to add to `config.yml`)

| Phase | Collection | Content source to migrate |
|---|---|---|
| 3 | **SEO per page** (title/desc/canonical/OG/robots) | `src/lib/seo.ts` → `src/content/seo.json` (also feeds `scripts/prerender.mjs`) |
| 4 | **FAQs / Areas / Listings** | `src/data/mockData.ts` arrays → `src/content/*.json` |
| 5 | **Page bodies** (sections, text, images, buttons, order, show/hide) | the large refactor: move inline JSX/i18n copy into per-section content models (F-012) |

Each phase = migrate the data to a JSON/markdown file + add a Decap collection
pointing at it + make the component read the file. The pattern is already proven
by Site Settings in Phase 1.

## What a git-based CMS does NOT do (by design)
- **Instant DB save** — publishing = a commit + redeploy (~1–2 min), not a live
  DB write. This is the trade-off that keeps the site static, fast, and SEO-baked.
- **Per-visitor drafts** — draft/preview works via editorial-workflow branches,
  addable later.
