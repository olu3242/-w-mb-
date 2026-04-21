@AGENTS.md

# Ówàmbẹ̀ — Project Context

## Stack
- Next.js 16 App Router + TypeScript (strict)
- Supabase (Postgres + RLS + SSR auth via `@supabase/ssr`)
- Tailwind CSS v4 (design tokens in `globals.css`)
- Zustand (client state), Zod (validation), Resend (email)
- Vercel (deploy)

## Design Tokens
```
--color-void:  #080808   bg
--color-pulse: #e8a44a   primary CTA
--color-sage:  #4caf7d   money / success
--color-ocean: #4a8fe8   links / info
```
Fonts: `font-display` = Syne · `font-sans` = Instrument Sans · `font-mono` = JetBrains Mono

## Key Conventions
- Server Components by default; add `'use client'` only when needed
- Server Actions in `app/actions/` — always `'use server'`, return `void`
- Supabase: `lib/supabase/client.ts` (browser) · `server.ts` (RSC/actions) · `middleware.ts`
- Auth guard in `app/(dashboard)/layout.tsx` — redirects to `/login`
- `formatCurrency(cents)` — amounts stored as **integer cents** throughout
- `generateSlug(title)` — appends 5-char random suffix for uniqueness

## Adaptive Signal System
`events.signals` JSONB unlocks features:
| Signal | Unlocks |
|---|---|
| `has_contributions` | Gift registry |
| `has_venue` | Venue tools |
| `has_vendors` | Vendor hub |
| `has_tasks` | Task board |
| `has_timeline` | Timeline |
| `has_budget_profile` | Budget engine |

## File Structure
```
app/
  (auth)/login|signup        auth pages
  (dashboard)/
    layout.tsx               auth guard + shell
    dashboard/               home
    events/                  list
    events/new/              2-step wizard
    events/[slug]/           hub + tab nav
      gifts/ tasks/ budget/ vendors/
  e/[slug]/                  public guest page
  api/events/ contributions/ stripe/ auth/signout/
  actions/                   gifts.ts tasks.ts budget.ts vendors.ts
components/
  ui/                        Button Input Textarea Card Badge Modal Select
  layout/                    sidebar nav mobile-nav
  events/                    task-status-button vendor-status-select
  shared/                    (empty-state avatar qr-code — TODO)
lib/
  supabase/client server middleware
  stripe/client   resend/client
  utils.ts        validations.ts
stores/            auth-store.ts  event-store.ts
types/             index.ts  database.ts
supabase/
  config.toml
  migrations/001_schema.sql  002_rls.sql
```

## Local Dev
```bash
cp .env.example .env.local   # fill vars
npm install
supabase start               # requires Supabase CLI
supabase db reset            # applies migrations
npm run dev                  # http://localhost:3000
```

## Scripts
```bash
npm run dev          # local dev server
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run db:types     # regenerate types/database.ts
npm run db:reset     # reset local Supabase
```

## Sub-agents
`@arch` `@ux` `@gtm` — see `.claude/agents/`
