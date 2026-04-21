# ALICE — AI Event Planner Agent

ALICE (Automated Logistics & Intelligent Cost Engine) is the premium AI planning layer for Ówàmbẹ̀ events.

## Unlock Flow

1. Event host clicks "Unlock ALICE" on event hub (`/events/[slug]`)
2. POST `/api/alice-unlock` → Paystack `initialize` → return `authorization_url`
3. Host completes payment on Paystack hosted page
4. Paystack fires `charge.success` webhook → `/api/paystack`
5. Webhook verifies HMAC-SHA512 signature, extracts event ID from reference `OWAMBE-ALICE-{uuid}-{ts}`
6. Sets `events.alice_unlocked = true`, records `alice_paid_at` + `alice_payment_ref`
7. Signals `alice_calibrated` and `alice_budget_generated` remain `false` until calibration

## Calibration Flow

1. ALICE tab visible once `alice_unlocked = true`
2. Host fills `AliceCalibrationForm`: guest_count, style_tier, location_type, hero_element, budget_ceiling (optional), event_month, event_dow, raw_notes
3. `calibrateAlice` action: upserts `event_context`, sets `alice_calibrated = true` via `update_event_signal`
4. `generateAliceBudget` action: calls `calculate_alice_budget` + `get_facet_allocations` RPCs, upserts `event_facets`, sets `alice_budget_generated = true`

## Budget Engine (RPCs)

### `calculate_alice_budget`

Base per-guest rates (NGN):
- intimate (≤20): 8,000
- standard (≤80): 15,000
- premium (≤200): 28,000
- luxury (201+): 55,000

Multipliers:
- Outdoor: ×1.15, Hybrid: ×1.25
- Nov/Dec: +20%, Apr: +10%
- Saturday: +15%, Friday: +8%

Returns `{ raw_total, final_total, demand_multiplier }` — capped at `budget_ceiling` if provided.

### `get_facet_allocations`

8 budget facets with percentage allocations by style tier. Hero element boosts relevant facet by +5pp (redistributed from others).

Facets: catering, venue, decor, photography, music, logistics, attire, miscellaneous

## Database Tables

| Table | Purpose |
|---|---|
| `event_context` | Calibration inputs (guest_count, style_tier, etc.) |
| `event_facets` | Budget output (raw_total, final_total, allocations) |
| `alice_alerts` | Proactive warnings (budget overrun, missing vendor, etc.) |
| `alice_decisions` | Host accept/reject decisions on ALICE suggestions |
| `system_events` | Audit log for all ALICE actions |
| `vendor_invites` | Invitations sent to vendors via ALICE |

## Actions (`app/actions/alice.ts`)

- `calibrateAlice(eventId, slug, formData)` — upsert event_context, update signal
- `generateAliceBudget(eventId, slug)` — call RPCs, upsert event_facets, update signal
- `runAliceMonitor(eventId, slug)` — generate alerts (budget, tasks, vendors)
- `resolveAliceAlert(alertId, slug)` — mark alert resolved
- `recordAliceDecision(eventId, slug, type, payload, accepted)` — log host decision

## Payment Reference Format

`OWAMBE-ALICE-{event_uuid}-{unix_timestamp_ms}`

UUID v4 has 5 hyphen-separated segments → reference splits as:
`[OWAMBE, ALICE, seg1, seg2, seg3, seg4, seg5, timestamp]`
Extract event ID: `parts.slice(2, 7).join('-')`

## Fee

Set via `ALICE_FEE_KOBO` env var (default: `5000000` = ₦50,000).
