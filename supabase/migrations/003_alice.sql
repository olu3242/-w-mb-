-- Extend events with ALICE fields
alter table events
  add column if not exists alice_unlocked boolean not null default false,
  add column if not exists alice_paid_at timestamptz,
  add column if not exists alice_payment_ref text;

-- Add paystack_reference to contributions
alter table contributions
  add column if not exists paystack_reference text unique;

-- event_context: ALICE calibration inputs
create table event_context (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade unique,
  guest_count int not null default 50,
  style_tier text not null default 'standard',
  location_type text not null default 'indoor',
  hero_element text not null default 'food',
  budget_ceiling numeric,
  event_month int,
  event_dow int,
  raw_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- event_facets: computed budget breakdown
create table event_facets (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade unique,
  context_id uuid references event_context(id) on delete cascade,
  raw_total numeric,
  final_total numeric,
  demand_multiplier numeric,
  allocations jsonb not null default '{}',
  generated_at timestamptz not null default now()
);

-- alice_alerts: monitor warnings
create table alice_alerts (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  alert_type text not null,
  severity text not null default 'info',
  message text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- alice_decisions: recommendations accepted/rejected
create table alice_decisions (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  decision_type text not null,
  payload jsonb not null default '{}',
  accepted boolean,
  created_at timestamptz not null default now()
);

-- system_events: audit log
create table system_events (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- vendor_invites
create table vendor_invites (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  vendor_id uuid references vendors(id) on delete set null,
  email text not null,
  name text,
  status text not null default 'pending',
  token text unique not null default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now()
);

create trigger event_context_updated_at before update on event_context
  for each row execute procedure update_updated_at();
