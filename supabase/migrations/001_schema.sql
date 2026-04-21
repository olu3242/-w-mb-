create extension if not exists "uuid-ossp";

create table events (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  event_date timestamptz,
  location text,
  is_public boolean not null default true,
  signals jsonb not null default '{}',
  owner_id uuid not null references auth.users(id) on delete cascade,
  stripe_account_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gift_items (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  title text not null,
  description text,
  amount int not null,
  is_funded boolean not null default false,
  created_at timestamptz not null default now()
);

create table contributions (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  gift_item_id uuid references gift_items(id) on delete set null,
  amount int not null,
  contributor_name text not null,
  contributor_email text not null,
  message text,
  stripe_payment_intent_id text unique not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  title text not null,
  assigned_to uuid references auth.users(id) on delete set null,
  due_date date,
  status text not null default 'todo',
  created_at timestamptz not null default now()
);

create table vendors (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  category text not null,
  contact text,
  cost int,
  status text not null default 'prospect',
  created_at timestamptz not null default now()
);

create table budget_lines (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  category text not null,
  label text not null,
  estimated int not null,
  actual int,
  created_at timestamptz not null default now()
);

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger events_updated_at before update on events
  for each row execute procedure update_updated_at();
