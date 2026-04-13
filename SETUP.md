# Widespread Blogs — Complete Setup & Deployment Guide (v2)

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database, Auth, RLS | Supabase |
| Hosting | Vercel |

---

## Overview of Roles

| Role | How to get it | What they can do |
|------|--------------|-----------------|
| **Public visitor** | No account needed | Read all blogs |
| **User** | Sign up with email | Read + write blogs, view own dashboard |
| **Admin** | Manually set by you in Supabase | Full admin panel (posts, users, categories) |

---

## STEP 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**.
2. Choose a name (e.g., `widespread-blogs`), set a strong **Database Password**, pick a region close to India (Singapore works well).
3. Wait ~2 minutes for provisioning.

---

## STEP 2 — Run the Database Schema

1. In the Supabase dashboard → **SQL Editor** → **New Query**.
2. Paste the entire contents of `supabase-schema.sql` and click **Run**.

This creates:
- `categories` table (with 4 seeded categories)
- `profiles` table (`is_admin`, `is_flagged`, `is_banned`)
- `blogs` table (`is_flagged`)
- Row Level Security (RLS) policies
- Auto-create profile trigger on signup

---

## STEP 3 — Get Your API Keys

Go to **Project Settings → API** and copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## STEP 4 — Configure Email Auth

1. **Authentication → Providers → Email** — make sure it is **Enabled**.
2. For easier local testing you can temporarily disable "Confirm email" (re-enable before going public).

---

## STEP 5 — Run Locally

```bash
cd widespread-blogs

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Open `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```bash
npm run dev
# → http://localhost:3000
```

---

## STEP 6 — Make Yourself Admin

1. Go to `http://localhost:3000/auth/register` and create your account.
2. Back in Supabase → **SQL Editor** → run:

```sql
UPDATE public.profiles
SET is_admin = true
WHERE email = 'YOUR_EMAIL@example.com';
```

3. Refresh the app. You will now see an **Admin** button in the navbar.
4. Your admin panel is at `/admin`.

> **Security:** The admin guard is server-side in `app/admin/layout.tsx` — it checks `is_admin` in the database before rendering any admin page. It cannot be bypassed from the browser.

---

## STEP 7 — Deploy to Vercel

### Option A — Vercel Dashboard (recommended for first deploy)

1. Push the `widespread-blogs` folder to a **GitHub repository**.
   ```bash
   cd widespread-blogs
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/widespread-blogs.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → Import your repo.
3. Under **Environment Variables**, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL        = https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJh...
   ```
4. Click **Deploy**. You'll get a URL like `https://widespread-blogs.vercel.app`.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel login
cd widespread-blogs
vercel --prod
```

---

## STEP 8 — Add Your Live URL to Supabase

After deployment, go to Supabase → **Authentication → URL Configuration** and set:

| Field | Value |
|-------|-------|
| **Site URL** | `https://your-app.vercel.app` |
| **Redirect URLs** | `https://your-app.vercel.app/auth/callback` |

This is required for email confirmation links to work in production.

---

## Admin Panel Features

| Page | URL | What you can do |
|------|-----|----------------|
| Overview | `/admin` | Stats: total posts, users, flagged items |
| Posts | `/admin/posts` | Flag + reason, unflag, move to category, delete |
| Users | `/admin/users` | Flag + reason, ban + reason, unban, remove flag |
| Categories | `/admin/categories` | Add new categories, edit icon/description/gradient, delete |

**When you flag a post or user**, the reason is immediately visible on their **User Dashboard** (`/dashboard`). They see exactly what was flagged and why.

**When you ban a user**, they can still read all blogs but cannot submit new posts. The write form shows a ban notice.

---

## User Dashboard Features (`/dashboard`)

- Account status banner (banned / flagged notices with reason)
- Post count stats (total, active, flagged)
- List of flagged posts with flag reasons highlighted
- Full post history with status badges
- Direct links to view each post

---

## Project Structure (v2)

```
widespread-blogs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Home (dynamic categories)
│   ├── not-found.tsx
│   ├── globals.css
│   ├── admin/
│   │   ├── layout.tsx                # ← Server-side admin guard
│   │   ├── page.tsx                  # Stats overview
│   │   ├── posts/page.tsx            # Flag, move, delete posts
│   │   ├── users/page.tsx            # Flag, ban users
│   │   └── categories/page.tsx       # Manage categories
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/route.ts
│   ├── blogs/
│   │   ├── create/page.tsx           # Auth + ban check
│   │   └── [category]/
│   │       ├── page.tsx              # Dynamic category page
│   │       └── [id]/page.tsx         # Individual blog post
│   ├── dashboard/page.tsx            # User dashboard
│   ├── contact/page.tsx
│   ├── our-team/page.tsx
│   ├── privacy-policy/page.tsx
│   └── terms/page.tsx
├── components/
│   ├── Navbar.tsx                    # Dynamic categories, admin button
│   ├── Footer.tsx
│   ├── BlogCard.tsx
│   ├── CategoryCard.tsx
│   └── admin/
│       └── AdminSidebar.tsx
├── lib/
│   ├── supabase.ts
│   ├── database.types.ts
│   └── categories.ts                 # Static fallback + helpers
├── middleware.ts                     # Session refresh
├── supabase-schema.sql               # ← Run this in Supabase SQL Editor
├── vercel.json
└── package.json
```

---

## Adding New Categories (after launch)

1. Go to `/admin/categories` → **New Category**.
2. Fill in: icon, label, description, hero image URL, gradient, sort order.
3. The slug is auto-generated from the label (e.g. "Technology" → `technology`).
4. The category immediately appears in the navbar dropdown, home page, and blog creation form.
5. Users can now write blogs under the new category at `/blogs/technology`.

---

## Security Summary

| Threat | How it's handled |
|--------|-----------------|
| Unauthorized admin access | Server-side `is_admin` check in layout before any rendering |
| SQL injection | Supabase parameterized queries — no raw SQL in app |
| Banned user posting | Checked client-side in UI AND enforced via Supabase RLS policy |
| Unauthenticated posting | RLS policy requires `auth.role() = 'authenticated'` |
| Cross-user post manipulation | RLS `auth.uid() = user_id` check on UPDATE/DELETE |
| Password security | Handled entirely by Supabase Auth (bcrypt + JWT) |
| Exposed secrets | Only `NEXT_PUBLIC_` env vars in client — no service role key in app |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank screen / build error | Check `.env.local` has correct Supabase keys |
| "relation does not exist" | Re-run `supabase-schema.sql` in SQL Editor |
| Login redirects to wrong URL | Set Site URL + Redirect URL in Supabase Auth settings |
| Admin button not showing | Run the `UPDATE profiles SET is_admin = true` SQL for your email |
| Images not loading | Ensure image URLs are publicly accessible HTTPS links |
| User can still post after ban | Check RLS policies ran without errors in SQL Editor |
