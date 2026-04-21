create or replace function calculate_alice_budget(
  p_guest_count int,
  p_style_tier text,
  p_location_type text,
  p_budget_ceiling numeric default null,
  p_event_month int default null,
  p_event_dow int default null
) returns jsonb language plpgsql as $$
declare
  v_base_rate numeric;
  v_location_mult numeric := 1.0;
  v_demand_mult numeric := 1.0;
  v_raw_total numeric;
  v_final_total numeric;
begin
  v_base_rate := case p_style_tier
    when 'intimate' then 8000
    when 'standard' then 15000
    when 'premium'  then 28000
    when 'luxury'   then 55000
    else 15000
  end;

  v_location_mult := case p_location_type
    when 'outdoor' then 1.15
    when 'hybrid'  then 1.25
    else 1.0
  end;

  v_demand_mult := 1.0;
  if p_event_month in (11, 12) then v_demand_mult := v_demand_mult + 0.20; end if;
  if p_event_month = 4           then v_demand_mult := v_demand_mult + 0.10; end if;
  if p_event_dow = 6             then v_demand_mult := v_demand_mult + 0.15; end if;
  if p_event_dow = 5             then v_demand_mult := v_demand_mult + 0.08; end if;

  v_raw_total   := p_guest_count * v_base_rate * v_location_mult;
  v_final_total := v_raw_total * v_demand_mult;

  if p_budget_ceiling is not null and v_final_total > p_budget_ceiling then
    v_final_total := p_budget_ceiling;
  end if;

  return jsonb_build_object(
    'raw_total',         v_raw_total,
    'final_total',       v_final_total,
    'demand_multiplier', v_demand_mult
  );
end;
$$;

create or replace function get_facet_allocations(
  p_style_tier text,
  p_hero_element text default 'food'
) returns jsonb language plpgsql as $$
declare
  v_alloc jsonb;
  v_hero_pct int;
  v_misc_pct int;
begin
  v_alloc := case p_style_tier
    when 'intimate' then
      '{"catering":40,"entertainment":10,"decor":15,"venue":15,"photography":8,"logistics":5,"attire":5,"miscellaneous":2}'::jsonb
    when 'premium' then
      '{"catering":30,"entertainment":18,"decor":18,"venue":15,"photography":10,"logistics":4,"attire":4,"miscellaneous":1}'::jsonb
    when 'luxury' then
      '{"catering":25,"entertainment":22,"decor":22,"venue":15,"photography":10,"logistics":3,"attire":2,"miscellaneous":1}'::jsonb
    else
      '{"catering":35,"entertainment":15,"decor":15,"venue":15,"photography":9,"logistics":5,"attire":4,"miscellaneous":2}'::jsonb
  end;

  if p_hero_element = any(array['catering','entertainment','decor','venue','photography']) then
    v_hero_pct := (v_alloc->>p_hero_element)::int + 5;
    v_misc_pct := greatest(0, (v_alloc->>'miscellaneous')::int - 5);
    v_alloc := jsonb_set(v_alloc, array[p_hero_element], to_jsonb(v_hero_pct));
    v_alloc := jsonb_set(v_alloc, '{miscellaneous}', to_jsonb(v_misc_pct));
  end if;

  return v_alloc;
end;
$$;

create or replace function update_event_signal(
  p_event_id uuid,
  p_signal text,
  p_value boolean
) returns void language plpgsql security definer as $$
begin
  update events
  set signals = jsonb_set(signals, array[p_signal], to_jsonb(p_value), true)
  where id = p_event_id;
end;
$$;
