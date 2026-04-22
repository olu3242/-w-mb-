-- payments table (idempotent, provider-agnostic)
create table payments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  vendor_id uuid references vendors(id) on delete set null,
  amount numeric not null,
  provider text not null check (provider in ('stripe', 'paystack')),
  reference text not null unique,
  status text not null default 'pending' check (status in ('pending', 'verified', 'failed')),
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- vendor invite lifecycle columns
alter table vendor_invites
  add column if not exists expires_at timestamptz,
  add column if not exists accepted_at timestamptz;

-- default 7-day expiry for existing rows
update vendor_invites set expires_at = created_at + interval '7 days' where expires_at is null;

-- event_vendors junction (invite → confirmed vendor per facet)
create table event_vendors (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  vendor_id uuid not null references vendors(id) on delete cascade,
  invite_id uuid references vendor_invites(id) on delete set null,
  facet_name text not null,
  quote_amount numeric,
  status text not null default 'invited' check (status in ('invited', 'confirmed', 'active')),
  created_at timestamptz not null default now(),
  unique (event_id, vendor_id)
);

-- facet payment/quote tracking columns
alter table event_facets
  add column if not exists amount_paid numeric not null default 0,
  add column if not exists balance_due numeric not null default 0,
  add column if not exists payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'partial', 'paid')),
  add column if not exists actual_quotes jsonb not null default '{}';

-- RLS
alter table payments enable row level security;
alter table event_vendors enable row level security;

create policy "payments_owner" on payments for all using (
  exists (select 1 from events e where e.id = event_id and e.owner_id = auth.uid())
);
create policy "event_vendors_owner" on event_vendors for all using (
  exists (select 1 from events e where e.id = event_id and e.owner_id = auth.uid())
);

-- allow unauthenticated token-based read of vendor_invites (token is the secret)
create policy "vendor_invites_public_token_read" on vendor_invites
  for select using (true);
