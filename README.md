# Widespread Blogs

A full-stack community blogging platform where users can write, publish, and explore blogs across multiple knowledge categories. Built with a modern tech stack and deployed on Vercel with Supabase as the backend.

---

## Live Demo

> **URL:** `https://widespread-blogs.vercel.app`
> **Admin login:** `sanind2004@gmail.com`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + GoTrue) |
| Hosting | Vercel |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## Project Structure

```
widespread-blogs/
├── app/
│   ├── admin/
│   │   ├── categories/      # Admin: manage blog categories
│   │   ├── posts/           # Admin: flag, move, delete posts
│   │   ├── settings/        # Admin: site settings (contact, social links)
│   │   ├── users/           # Admin: flag and ban users
│   │   ├── layout.tsx       # Admin guard (server-side is_admin check)
│   │   ├── loading.tsx      # Admin panel loading state
│   │   └── page.tsx         # Admin overview dashboard
│   ├── auth/
│   │   ├── login/           # Sign in page
│   │   └── register/        # Create account page
│   ├── blogs/
│   │   ├── [category]/      # Category listing page
│   │   │   └── [id]/        # Individual blog post page
│   │   ├── create/          # Write new blog (authenticated)
│   │   └── edit/[id]/       # Edit existing blog (owner only)
│   ├── contact/             # Contact page
│   ├── dashboard/           # User dashboard (posts, flags, stats)
│   ├── our-team/            # About / team page
│   ├── privacy-policy/      # Privacy policy
│   ├── terms/               # Terms and conditions
│   ├── globals.css          # Global styles + splash animation keyframes
│   ├── layout.tsx           # Root layout (Navbar, Footer, SplashScreen)
│   ├── loading.tsx          # Global page loading animation
│   └── page.tsx             # Homepage (hero, categories, recent blogs)
│
├── components/
│   ├── admin/
│   │   └── AdminSidebar.tsx # Admin panel sidebar navigation
│   ├── BlogCard.tsx          # Blog post preview card
│   ├── CategoryCard.tsx      # Category tile card
│   ├── Footer.tsx            # Footer with social links + newsletter widget
│   ├── Navbar.tsx            # Responsive navbar with auth state
│   ├── SplashScreen.tsx      # Animated intro (once per session)
│   └── UserBlogActions.tsx   # Edit / Delete buttons for user's own posts
│
├── lib/
│   ├── categories.ts         # Static fallback categories (used if DB is empty)
│   ├── database.types.ts     # TypeScript types for all Supabase tables
│   ├── site-settings-server.ts  # getSiteSettings() — server components only
│   ├── site-settings.ts      # SiteSettings interface + defaults (client-safe)
│   ├── supabase-server.ts    # createServerClient() — uses next/headers
│   └── supabase.ts           # createClient() — client components only
│
├── public/
│   └── favicon.svg           # Teal W lettermark favicon
│
├── supabase-schema.sql       # Full DB schema (run once to set up)
├── supabase-additions.sql    # Extra categories + site_settings table
└── .env.local                # Local env variables (never commit)
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Both values are found in **Supabase Dashboard → Project Settings → API**.

---

## Database Setup

Run both SQL files in the **Supabase SQL Editor** in order:

### 1. `supabase-schema.sql`
Sets up the core tables, RLS policies, and triggers:
- `categories` — dynamic blog categories
- `profiles` — extends Supabase auth users with admin/flag/ban fields
- `blogs` — blog posts with moderation fields
- Auto-creates a profile row on every new sign-up (via trigger)
- RLS policies for public read, authenticated insert, owner update/delete, admin all

### 2. `supabase-additions.sql`
- Inserts 6 additional categories (AI, Finance, Healthcare, Education, Wildlife, Technology)
- Creates `site_settings` key-value table for dynamic admin-controlled content
- Seeds default contact info and social link values

### 3. Make yourself admin
After registering your account through the app, run:
```sql
update public.profiles
set is_admin = true
where email = 'your-email@example.com';
```

---

## Key Architectural Decisions

### Supabase Client Split
The project uses **two separate Supabase clients** to avoid the `next/headers` error:

| File | Used in | Why |
|------|---------|-----|
| `lib/supabase.ts` | Client components | Uses `createClientComponentClient()` — no `next/headers` |
| `lib/supabase-server.ts` | Server components only | Uses `createServerComponentClient({ cookies })` from `next/headers` |

Similarly, `lib/site-settings.ts` is client-safe (types + defaults only), while `lib/site-settings-server.ts` has the async `getSiteSettings()` function.

### No `<Database>` Generic on Supabase Clients
`@supabase/auth-helpers-nextjs` v0.10.0 imports `GenericSchema` from `@supabase/supabase-js/dist/module/lib/types` — a path that no longer exists in supabase-js v2.100+. Passing `<Database>` generic causes all table types to collapse to `never`. The fix: omit the generic on both clients, keep type safety through explicit `as TypeName` casts on query results.

### Admin Security
The admin guard lives in `app/admin/layout.tsx` as a **server component** — it checks `is_admin` from the database before rendering any admin UI. This is impossible to bypass from the client side.

### Blog ID Pre-generation
When publishing a blog, the ID is generated client-side with `crypto.randomUUID()` and passed in the insert. This avoids the chained `.insert().select().single()` pattern which hangs on Supabase free tier cold starts.

---

## Pages Reference

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage — hero, categories, recent blogs |
| `/blogs/[category]` | Public | All blogs in a category |
| `/blogs/[category]/[id]` | Public | Individual blog post |
| `/blogs/create` | Authenticated | Write and publish a new blog |
| `/blogs/edit/[id]` | Owner only | Edit an existing blog post |
| `/auth/login` | Public | Sign in |
| `/auth/register` | Public | Create account |
| `/dashboard` | Authenticated | User's posts, stats, flag notices |
| `/admin` | Admin only | Overview stats |
| `/admin/posts` | Admin only | Manage all posts (flag/unflag/move/delete) |
| `/admin/users` | Admin only | Manage all users (flag/ban/unban) |
| `/admin/categories` | Admin only | Add/edit/delete categories |
| `/admin/settings` | Admin only | Update contact info, social links, newsletter URL |
| `/our-team` | Public | About page with admin profile (dynamic from settings) |
| `/contact` | Public | Contact information |
| `/privacy-policy` | Public | Privacy policy |
| `/terms` | Public | Terms and conditions |

---

## Features

### For Users
- Register and sign in with email/password
- Write and publish blogs with cover image, rich text, and category selection
- Edit or delete their own posts at any time
- Personal dashboard showing post stats and any moderation notices
- See flag reason if a post was flagged by admin

### For Admins
- Full admin panel at `/admin`
- Flag or unflag any post with a reason (user sees the reason on dashboard)
- Ban or unban users (banned users cannot post new content)
- Move posts between categories
- Add, edit, and delete categories (icon, gradient, hero image, sort order)
- Admin Settings page — change contact email, phone, location, profile photo, bio, and social links without touching code

### Platform
- Splash screen animation on first visit (once per browser session)
- Animated page loading states between navigation
- Responsive design — works on mobile and desktop
- Dynamic categories from the database (navbar dropdown auto-updates)
- Newsletter widget in footer (shows "Coming Soon" if no URL set, or links to newsletter if URL is configured in Admin Settings)
- Custom SVG favicon (teal W lettermark)

---

## Deploying Updates

Every push to the `main` branch on GitHub auto-deploys via Vercel:

```bash
git add .
git commit -m "describe your change"
git push
```

Vercel typically deploys within 60 seconds.

---

## Pending / Future Enhancements

These features are planned but not yet built:

### Newsletter
- The footer has a "Coming Soon" widget ready
- In `Admin Settings → Newsletter URL`, paste your newsletter signup URL (e.g. Mailchimp, ConvertKit, Substack)
- The footer widget will automatically switch from "Coming Soon" to a live signup button
- To build a full in-app newsletter: create a `subscribers` table in Supabase, add a subscribe API route at `app/api/subscribe/route.ts`, and wire the footer form to it

### Other Ideas
- [ ] Rich text editor (e.g. Tiptap or Quill) instead of plain textarea
- [ ] Blog post search
- [ ] Comment system per blog post
- [ ] User profile pages (`/u/[username]`)
- [ ] Like / bookmark functionality
- [ ] Pagination on category pages
- [ ] Email notifications when a post is flagged
- [ ] Image uploads (Supabase Storage) instead of URL-only cover images
- [ ] Public author profiles

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Type check
npx tsc --noEmit

# Build for production
npm run build
```

If the dev server shows webpack cache errors, clear the cache:
```bash
rm -rf .next
npm run dev
```

---

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| `brand-teal` | `#1CD6CE` | Primary accent, buttons, links |
| `brand-dark` | `#1B2430` | Dark backgrounds, navbar |
| `brand-navy` | (Tailwind default) | Text on light backgrounds |

Defined in `tailwind.config.ts` under `theme.extend.colors`.

---

## Social Links

| Platform | Handle |
|----------|--------|
| GitHub | [DevelopingGod](https://github.com/DevelopingGod) |
| LinkedIn | [sankalp-indish](https://www.linkedin.com/in/sankalp-indish/) |
| X (Twitter) | [@cutecreeperyt](https://x.com/cutecreeperyt) |

---

*Built by Sankalp Indish — Widespread Blogs © 2025*
