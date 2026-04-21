-- Naija-Aware budget engine: geospatial + 20.38% inflation buffer
create or replace function calculate_alice_budget(
  p_guest_count     int,
  p_style_tier      text,
  p_location_type   text,
  p_location_area   text    default 'state_capital',
  p_budget_ceiling  numeric default null,
  p_event_month     int     default null,
  p_event_dow       int     default null
) returns jsonb language plpgsql security definer as $$
declare
  v_base_rate      numeric;
  v_location_mult  numeric := 1.0;
  v_area_mult      numeric := 1.0;
  v_demand_mult    numeric := 1.0;
  v_inflation_mult constant numeric := 1.2038;  -- 15.38% CPI + 5% wahala
  v_raw_total      numeric;
  v_final_total    numeric;
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

  -- Geospatial: Lekki/VI/Ikoyi/Maitama/Asokoro = premium
  v_area_mult := case p_location_area
    when 'premium'       then 1.80
    when 'urban'         then 1.30
    when 'state_capital' then 1.00
    when 'other'         then 0.85
    else 1.00
  end;

  if p_event_month in (11, 12) then v_demand_mult := v_demand_mult + 0.20; end if;
  if p_event_month = 4          then v_demand_mult := v_demand_mult + 0.10; end if;
  if p_event_dow = 6            then v_demand_mult := v_demand_mult + 0.15; end if;
  if p_event_dow = 5            then v_demand_mult := v_demand_mult + 0.08; end if;

  v_raw_total   := p_guest_count * v_base_rate * v_location_mult * v_area_mult * v_inflation_mult;
  v_final_total := v_raw_total * v_demand_mult;

  if p_budget_ceiling is not null and v_final_total > p_budget_ceiling then
    v_final_total := p_budget_ceiling;
  end if;

  return jsonb_build_object(
    'raw_total',         round(v_raw_total),
    'final_total',       round(v_final_total),
    'demand_multiplier', round(v_demand_mult::numeric, 2),
    'area_multiplier',   round(v_area_mult::numeric, 2),
    'inflation_buffer',  0.2038
  );
end;
$$;

-- 8 Naija facets: Food is King. Crisis triage cuts Tier 3 to protect Hero.
create or replace function get_facet_allocations(
  p_style_tier         text,
  p_hero_element       text    default 'catering',
  p_crisis_deficit_pct numeric default 0
) returns jsonb language plpgsql security definer as $$
declare
  v_alloc      jsonb;
  v_triage_cut numeric;
begin
  v_alloc := case p_style_tier
    when 'intimate' then jsonb_build_object(
      'catering', 35, 'venue', 20, 'decor', 12, 'media', 8,
      'entertainment', 10, 'security', 5, 'souvenirs', 5, 'admin', 5
    )
    when 'premium' then jsonb_build_object(
      'catering', 30, 'venue', 18, 'decor', 15, 'media', 10,
      'entertainment', 12, 'security', 6, 'souvenirs', 5, 'admin', 4
    )
    when 'luxury' then jsonb_build_object(
      'catering', 28, 'venue', 18, 'decor', 15, 'media', 11,
      'entertainment', 13, 'security', 7, 'souvenirs', 5, 'admin', 3
    )
    else jsonb_build_object(
      'catering', 32, 'venue', 20, 'decor', 13, 'media', 9,
      'entertainment', 10, 'security', 5, 'souvenirs', 6, 'admin', 5
    )
  end;

  -- Hero element boost: +5pp trimmed from souvenirs + admin
  if p_hero_element != 'catering' and v_alloc ? p_hero_element then
    v_alloc := jsonb_set(v_alloc, array[p_hero_element],
      to_jsonb((v_alloc->>p_hero_element)::numeric + 5));
    v_alloc := jsonb_set(v_alloc, '{souvenirs}',
      to_jsonb(greatest(2, (v_alloc->>'souvenirs')::numeric - 2.5)));
    v_alloc := jsonb_set(v_alloc, '{admin}',
      to_jsonb(greatest(2, (v_alloc->>'admin')::numeric - 2.5)));
  end if;

  -- Crisis triage: cut Tier 3 (souvenirs+admin) 30% → protect catering
  if p_crisis_deficit_pct > 0 then
    v_triage_cut := (v_alloc->>'souvenirs')::numeric * 0.30
                  + (v_alloc->>'admin')::numeric * 0.30;
    v_alloc := jsonb_set(v_alloc, '{souvenirs}',
      to_jsonb((v_alloc->>'souvenirs')::numeric * 0.70));
    v_alloc := jsonb_set(v_alloc, '{admin}',
      to_jsonb((v_alloc->>'admin')::numeric * 0.70));
    v_alloc := jsonb_set(v_alloc, '{catering}',
      to_jsonb((v_alloc->>'catering')::numeric + v_triage_cut));
  end if;

  return v_alloc;
end;
$$;

create or replace function update_event_signal(
  p_event_id uuid,
  p_signal   text,
  p_value    boolean
) returns void language plpgsql security definer as $$
begin
  update events
  set signals = jsonb_set(signals, array[p_signal], to_jsonb(p_value), true)
  where id = p_event_id;
end;
$$;
