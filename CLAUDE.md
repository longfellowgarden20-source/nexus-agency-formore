# CLAUDE.md — Fast Websites Nexus Agency

## Project Overview
Next.js website for Fast Websites agency (fastwebsitesagency.com). Contains the public-facing agency site plus a full client management system with AI chat widgets powered by Groq.

## Current Status
- Public site: built and deployed
- AI chat widget: built, live on site
- Admin panel: built, needs Vercel env vars to go live
- Client admin panel: built

## Planned Feature — Website Preview Generator
The next major feature to build:
1. On a lead's detail page in the scraper (webScraperForAgency project), add a "Generate Website Preview" button
2. Groq reads the lead's business name, city, category, and generates: headline, tagline, color scheme (industry-based), and copy for each section
3. Save the generated config to a `previews` table in Supabase with a unique ID
4. Render the preview at `/preview/[id]` using the owner's existing Next.js templates — just swap text and colors dynamically
5. The lead detail page shows a shareable link the owner can send via the existing Gmail mailto button
6. Business owner clicks the link and sees a website that looks like it's already theirs

**Industry color mapping:**
- Plumber → blue
- Electrician → yellow  
- Restaurant → warm red/orange
- Landscaper → green
- Salon → purple/rose

**Before building:** Ask the user how many templates they have and confirm they are in this project as Next.js components where text and colors can be swapped via props.

## Architecture
- **Framework:** Next.js 15 App Router
- **Database:** Supabase (shared with webScraperForAgency)
- **AI:** Groq API (`llama-3.1-8b-instant`) via raw fetch — never use SDK
- **Auth:** Cookie-based — admin uses `ADMIN_PASSWORD`, clients use business name + password
- **Styling:** Tailwind CSS, dark theme, `#0ea5e9` accent

## Key Routes
- `/admin` — your master panel (password protected)
- `/admin/clients/new` — onboard a new client
- `/admin/clients/[id]` — edit any client
- `/client-admin` — client login page
- `/client-admin/[id]` — client's bot config dashboard
- `/api/admin/auth` — admin login/logout
- `/api/admin/clients` — CRUD for clients (admin only)
- `/api/client/[id]` — read/update own data (client only)
- `/api/client-auth` — client login/logout
- `/api/chat` — Groq chat, accepts optional `clientId` to load per-client config

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GROQ_API_KEY
ADMIN_PASSWORD
```

## Supabase Tables
- `clients` — bot config per client, password_hash, active flag
- `conversations` — every chat message logged per client
- `projects` — website build projects
- `invoices` — billing
- `estimates` — AI-generated contractor estimates

## Hard Rules
- Never expose SUPABASE_SERVICE_ROLE_KEY or GROQ_API_KEY client-side
- Always use `getSupabaseAdmin()` factory function in API routes — never module-level singleton
- All API routes must have `export const dynamic = 'force-dynamic'`
- Clients can only read/write their own row — never expose other clients' data
- Never auto-send emails — always mailto or manual
- No Tailwind default palette — use `#0ea5e9` system only
