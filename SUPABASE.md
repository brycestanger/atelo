# Wiring the backend — Supabase, step by step

Atelo ships fully working on mock data. This connects it to a real backend:
**Postgres + magic-link auth + image storage.** The app auto-detects whether
Supabase is configured (`isSupabaseConfigured`) and degrades to demo mode when
it isn't — so nothing breaks while you set this up.

Time: ~2 minutes (your keys are already in `.env.local`).

> **Status:** the app is now fully wired to Supabase — creating boards, uploading
> product photos + colour swatches, the shareable client link, swipe recording,
> and report generation all use the real backend (with a mock fallback so the demo
> keeps working). The **only** remaining step is **applying the schema (step 3)**
> plus the **auth redirect (step 4)**. Connection is already verified.

---

## 1 · Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Name it `atelo`, pick a region near you, set a database password (save it).
3. Wait ~2 min for it to provision.

## 2 · Add your keys
In the dashboard: **Project Settings → API**. Copy into `.env.local`
(`cp .env.example .env.local` first):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co   # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...            # anon / public key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...                # service_role (server only!)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> The `service_role` key bypasses RLS. Never expose it to the browser — it's only
> for trusted server code (e.g. the future AI report job).

## 3 · Create the schema
**SQL Editor → New query** → paste the whole of [`supabase/schema.sql`](./supabase/schema.sql)
→ **Run**. This creates the tables (`profiles, projects, categories, options,
sessions, responses, winners`), row-level-security policies, the `options` storage
bucket, and a trigger that makes a profile row on signup. It's safe to re-run.

## 4 · Turn on magic-link auth
1. **Authentication → Providers → Email**: make sure it's enabled (it is by default).
   Leave "Confirm email" on; magic links work with it.
2. **Authentication → URL Configuration**:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** add `http://localhost:3000/auth/callback`
     (and later your production `https://…/auth/callback`).

That's it — the login page (`/login`) already calls `signInWithOtp` and the
handler at [`app/auth/callback/route.ts`](./app/auth/callback/route.ts) exchanges
the code for a session.

## 5 · Install + run
```bash
npm install     # pulls @supabase/ssr + supabase-js
npm run dev
```
Visit `/login`, enter your email, click the link in your inbox → you land on
`/dashboard` signed in.

## 6 · (Recommended) Session refresh middleware
For long sessions, add a `middleware.ts` at the repo root that calls
`supabase.auth.getUser()` to refresh tokens on `/dashboard/*`. Standard pattern
from the Supabase SSR docs — omitted here to keep the scaffold lean.

---

## Wiring the create flow (`/dashboard/new`)
The wizard is UI-complete on mock state. To persist it, call the server action in
[`lib/actions/projects.ts`](./lib/actions/projects.ts) from the final step:

```tsx
import { createProject } from "@/lib/actions/projects";

const res = await createProject({
  name,
  client,
  categories: cats.map((name) => ({ name, kind: "photo" })), // colour cats: "swatch"
});
if (res.ok) router.push(`/dashboard/project/${res.slug}`);
// res.ok === false → { reason: "not-configured" | "unauthenticated" | ... } → stay in demo
```

### Uploading option images (Storage)
From the upload step, push files to the public `options` bucket with the browser
client, then store the returned path on the option row:

```tsx
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
const path = `${projectId}/${crypto.randomUUID()}-${file.name}`;
await supabase!.storage.from("options").upload(path, file);
// save `path` as options.image_path; render with
// supabase!.storage.from("options").getPublicUrl(path).data.publicUrl
```

## The client link (`/c/[slug]`)
Swap the mock loader for `getBoardBySlug(slug)` (already written). On the deck,
open a `sessions` row, insert a `responses` row per swipe, and write `winners`
after each showdown. RLS already allows the anonymous client to do this.

## Generate the report
Once a session is complete, send its liked + winning options to the AI route
(`/api/analyze`) with your `GEMINI_API_KEY`, and persist the returned `Brief`.
The report UI (`FinishReport`) already renders that shape.

---

## Security notes
- RLS is **on** for every table. Owners get full access to their own rows.
- Boards are **publicly readable by slug** — the link is the capability. For
  stricter privacy, keep slugs unguessable (the action appends a random suffix)
  or add a `share_token` column and match on it in the policy.
- Anonymous clients can insert sessions/responses/winners — scope this down with a
  per-session token if you expect abuse.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.

## Deploy (Vercel)
Add the four env vars in the Vercel project settings, and add your production
`https://your-domain/auth/callback` to Supabase **Redirect URLs** + set the
**Site URL** to your production domain.
