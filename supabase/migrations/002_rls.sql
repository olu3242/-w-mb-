alter table events enable row level security;
alter table gift_items enable row level security;
alter table contributions enable row level security;
alter table tasks enable row level security;
alter table vendors enable row level security;
alter table budget_lines enable row level security;

-- events
create policy "owner can do all" on events for all using (auth.uid() = owner_id);
create policy "public events visible to all" on events for select using (is_public = true);

-- gift_items
create policy "event owner manages gifts" on gift_items for all
  using (exists (select 1 from events where id = gift_items.event_id and owner_id = auth.uid()));
create policy "public gift items visible" on gift_items for select
  using (exists (select 1 from events where id = gift_items.event_id and is_public = true));

-- contributions
create policy "event owner reads contributions" on contributions for select
  using (exists (select 1 from events where id = contributions.event_id and owner_id = auth.uid()));
create policy "anyone can insert contribution" on contributions for insert with check (true);

-- tasks
create policy "event owner manages tasks" on tasks for all
  using (exists (select 1 from events where id = tasks.event_id and owner_id = auth.uid()));

-- vendors
create policy "event owner manages vendors" on vendors for all
  using (exists (select 1 from events where id = vendors.event_id and owner_id = auth.uid()));

-- budget_lines
create policy "event owner manages budget" on budget_lines for all
  using (exists (select 1 from events where id = budget_lines.event_id and owner_id = auth.uid()));
