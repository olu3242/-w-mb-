# -w-mb-
Ówàmbẹ̀, Wherever it's happening
# Ówàmbẹ̀ — Give. Plan. Celebrate.

Unified platform for gifting, planning, and executing any occasion.

## Stack
- Next.js 15 App Router + TypeScript
- Supabase (Postgres + RLS + Realtime + Storage)
- Stripe Connect Express
- Tailwind CSS
- Resend (email)
- Zustand (state)
- Vercel (deploy)

## Adaptive Signal System
Events carry a `signals` JSONB column. Features unlock as signals activate:

| Signal | Unlocks |
|---|---|
| `has_contributions` | Gift registry + Stripe payouts |
| `has_venue` | Venue tools |
| `has_vendors` | Vendor hub |
| `has_tasks` | Task board |
| `has_timeline` | Execution timeline |
| `has_budget_profile` | Budget engine |

## Setup
```bash
cp .env.example .env.local    # fill all vars
npm install
supabase start
supabase db reset              # applies 001_schema + 002_rls
npm run dev                    # http://localhost:3000
```

## Env Vars
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
```

## File Structure
```
app/
  page.tsx                     → Landing page
  (auth)/login|signup          → Auth pages
  (dashboard)/
    dashboard/                 → Home + stats
    events/                    → Event list
    events/new/                → Creation wizard (2-step)
    events/[slug]/             → Event hub
      gifts/                   → Registry + contributions
      tasks/                   → Task board
      budget/                  → Budget engine
      vendors/                 → Vendor hub
  e/[slug]/                    → Public guest page
  api/
    events/                    → CRUD
    contributions/             → Accept gifts
    webhooks/stripe/           → Stripe events
    stripe/connect/            → Onboarding
    auth/signout/              → Sign out
components/
  ui/                          → button, input, card, badge, modal, select
  layout/                      → nav, sidebar, mobile-nav
  events/                      → event-card, signal-badges
  gifts/                       → contribution-form
  shared/                      → empty-state, avatar, qr-code
lib/
  supabase/client|server|middleware
  stripe/client
  resend/client
  utils.ts                     → cn, formatCurrency, generateSlug
  validations.ts               → Zod schemas
stores/
  event-store.ts
  auth-store.ts
types/
  index.ts
  database.ts
supabase/migrations/
  001_schema.sql
  002_rls.sql
.claude/
  agents/arch.md|ux.md|gtm.md
```

## Scripts
```bash
npm run dev          # local dev
npm run build        # production
npm run typecheck    # tsc --noEmit
npm run db:types     # regenerate types/database.ts
npm run db:reset     # reset local Supabase
```

## Breakpoints
- Desktop: 1024px+
- Tablet: 768–1024px
- Mobile: <768px

## Design Tokens
```
void:    #080808  bg
pulse:   #e8a44a  primary CTA
sage:    #4caf7d  money/success
ocean:   #4a8fe8  links/info
```
Fonts: Syne (display) · Instrument Sans (body) · JetBrains Mono (mono)

## Claude Code
CLAUDE.md is pre-configured with full project context.
Sub-agents: `@arch` `@ux` `@gtm`
