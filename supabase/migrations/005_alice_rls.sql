alter table event_context   enable row level security;
alter table event_facets    enable row level security;
alter table alice_alerts    enable row level security;
alter table alice_decisions enable row level security;
alter table system_events   enable row level security;
alter table vendor_invites  enable row level security;

create policy "host manages context" on event_context for all
  using (exists (select 1 from events where id = event_context.event_id and owner_id = auth.uid()));

create policy "host manages facets" on event_facets for all
  using (exists (select 1 from events where id = event_facets.event_id and owner_id = auth.uid()));

create policy "host manages alerts" on alice_alerts for all
  using (exists (select 1 from events where id = alice_alerts.event_id and owner_id = auth.uid()));

create policy "host manages decisions" on alice_decisions for all
  using (exists (select 1 from events where id = alice_decisions.event_id and owner_id = auth.uid()));

create policy "host reads system_events" on system_events for select
  using (exists (select 1 from events where id = system_events.event_id and owner_id = auth.uid()));

create policy "host manages invites" on vendor_invites for all
  using (exists (select 1 from events where id = vendor_invites.event_id and owner_id = auth.uid()));
