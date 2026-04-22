-- ─────────────────────────────────────────────────────────────
-- credit_escrow
-- Called after payment is verified. Creates escrow account if
-- needed. Idempotent on reference.
-- ─────────────────────────────────────────────────────────────
create or replace function credit_escrow(
  p_event_id    uuid,
  p_amount      numeric,
  p_reference   text,
  p_payment_id  uuid default null
) returns jsonb language plpgsql security definer as $$
declare
  v_acct    escrow_accounts;
  v_new_bal numeric;
  v_avail   numeric;
begin
  -- Idempotency guard
  if exists (
    select 1 from escrow_transactions
    where event_id = p_event_id and reference = p_reference and type = 'credit'
  ) then
    return jsonb_build_object('status','already_credited','reference',p_reference);
  end if;

  -- Lock or create escrow account
  select * into v_acct from escrow_accounts
  where event_id = p_event_id for update;

  if not found then
    insert into escrow_accounts(event_id, balance, total_contributed)
    values(p_event_id, p_amount, p_amount)
    returning * into v_acct;
    v_new_bal := p_amount;
    v_avail   := p_amount;
  else
    if v_acct.status = 'frozen' then
      raise exception 'Escrow account is frozen for event %', p_event_id;
    end if;
    v_new_bal := v_acct.balance + p_amount;
    v_avail   := v_new_bal - v_acct.total_allocated;
    update escrow_accounts set
      balance           = v_new_bal,
      total_contributed = total_contributed + p_amount,
      updated_at        = now()
    where id = v_acct.id;
  end if;

  insert into escrow_transactions(
    escrow_account_id, event_id, type, amount,
    balance_after, available_after, reference, payment_id
  ) values(
    v_acct.id, p_event_id, 'credit', p_amount,
    v_new_bal, v_avail, p_reference, p_payment_id
  );

  return jsonb_build_object(
    'status','credited','balance',v_new_bal,'available',v_avail
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- allocate_escrow
-- Earmarks funds for a vendor. Fails if insufficient available
-- balance. Uses FOR UPDATE to prevent race conditions.
-- ─────────────────────────────────────────────────────────────
create or replace function allocate_escrow(
  p_event_id        uuid,
  p_vendor_id       uuid,
  p_amount          numeric,
  p_facet_name      text,
  p_event_vendor_id uuid    default null,
  p_notes           text    default null
) returns jsonb language plpgsql security definer as $$
declare
  v_acct        escrow_accounts;
  v_avail       numeric;
  v_alloc_id    uuid;
begin
  select * into v_acct from escrow_accounts
  where event_id = p_event_id for update;

  if not found then
    raise exception 'No escrow account for event %', p_event_id;
  end if;
  if v_acct.status != 'active' then
    raise exception 'Escrow account is %', v_acct.status;
  end if;

  v_avail := v_acct.balance - v_acct.total_allocated;

  if p_amount > v_avail then
    raise exception 'Insufficient balance: available=%, requested=%', v_avail, p_amount;
  end if;

  insert into vendor_allocations(
    event_id, escrow_account_id, vendor_id,
    event_vendor_id, facet_name, amount, notes
  ) values(
    p_event_id, v_acct.id, p_vendor_id,
    p_event_vendor_id, p_facet_name, p_amount, p_notes
  ) returning id into v_alloc_id;

  update escrow_accounts set
    total_allocated = total_allocated + p_amount,
    updated_at      = now()
  where id = v_acct.id;

  insert into escrow_transactions(
    escrow_account_id, event_id, type, amount,
    balance_after, available_after, allocation_id
  ) values(
    v_acct.id, p_event_id, 'allocation', p_amount,
    v_acct.balance, v_avail - p_amount, v_alloc_id
  );

  return jsonb_build_object(
    'status','allocated',
    'allocation_id', v_alloc_id,
    'available_after', v_avail - p_amount
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- cancel_allocation
-- Frees reserved funds back to available pool.
-- ─────────────────────────────────────────────────────────────
create or replace function cancel_allocation(
  p_allocation_id uuid
) returns jsonb language plpgsql security definer as $$
declare
  v_alloc vendor_allocations;
  v_acct  escrow_accounts;
  v_avail numeric;
begin
  select * into v_alloc from vendor_allocations
  where id = p_allocation_id for update;
  if not found then raise exception 'Allocation not found'; end if;
  if v_alloc.status not in ('pending','approved') then
    raise exception 'Cannot cancel allocation with status %', v_alloc.status;
  end if;

  select * into v_acct from escrow_accounts
  where id = v_alloc.escrow_account_id for update;

  update vendor_allocations set status = 'cancelled' where id = p_allocation_id;
  update escrow_accounts set
    total_allocated = total_allocated - v_alloc.amount,
    updated_at = now()
  where id = v_acct.id;

  v_avail := v_acct.balance - (v_acct.total_allocated - v_alloc.amount);

  insert into escrow_transactions(
    escrow_account_id, event_id, type, amount,
    balance_after, available_after, allocation_id
  ) values(
    v_acct.id, v_alloc.event_id, 'allocation_cancel', v_alloc.amount,
    v_acct.balance, v_avail, p_allocation_id
  );

  return jsonb_build_object('status','cancelled','available_after',v_avail);
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- approve_allocation
-- Moves allocation from pending → approved (authorises payout).
-- ─────────────────────────────────────────────────────────────
create or replace function approve_allocation(
  p_allocation_id uuid
) returns jsonb language plpgsql security definer as $$
declare
  v_alloc vendor_allocations;
begin
  select * into v_alloc from vendor_allocations
  where id = p_allocation_id for update;
  if not found then raise exception 'Allocation not found'; end if;
  if v_alloc.status != 'pending' then
    raise exception 'Allocation is already %', v_alloc.status;
  end if;

  update vendor_allocations set
    status = 'approved', approved_at = now()
  where id = p_allocation_id;

  return jsonb_build_object('status','approved','allocation_id',p_allocation_id);
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- complete_payout
-- Called after provider confirms transfer. Atomically debits
-- escrow balance, marks payout complete, writes ledger entry.
-- Idempotent on payout_id.
-- ─────────────────────────────────────────────────────────────
create or replace function complete_payout(
  p_payout_id          uuid,
  p_provider_reference text default null
) returns jsonb language plpgsql security definer as $$
declare
  v_payout  vendor_payouts;
  v_alloc   vendor_allocations;
  v_acct    escrow_accounts;
  v_new_bal numeric;
  v_avail   numeric;
begin
  select * into v_payout from vendor_payouts
  where id = p_payout_id for update;
  if not found then raise exception 'Payout not found'; end if;
  if v_payout.status = 'completed' then
    return jsonb_build_object('status','already_completed');
  end if;
  if v_payout.status = 'failed' then
    raise exception 'Cannot complete a failed payout';
  end if;

  select * into v_alloc from vendor_allocations
  where id = v_payout.allocation_id for update;
  if v_alloc.status != 'approved' then
    raise exception 'Allocation must be approved before payout can complete';
  end if;

  select * into v_acct from escrow_accounts
  where id = v_alloc.escrow_account_id for update;

  -- Debit balance
  v_new_bal := v_acct.balance - v_payout.amount;
  if v_new_bal < 0 then
    raise exception 'Escrow balance would go negative';
  end if;
  v_avail := v_new_bal - (v_acct.total_allocated - v_payout.amount);

  update escrow_accounts set
    balance         = v_new_bal,
    total_allocated = total_allocated - v_payout.amount,
    total_released  = total_released  + v_payout.amount,
    updated_at      = now()
  where id = v_acct.id;

  update vendor_allocations set
    status = 'released', released_at = now()
  where id = v_alloc.id;

  update vendor_payouts set
    status             = 'completed',
    completed_at       = now(),
    provider_reference = coalesce(p_provider_reference, provider_reference)
  where id = p_payout_id;

  insert into escrow_transactions(
    escrow_account_id, event_id, type, amount,
    balance_after, available_after, allocation_id, payout_id
  ) values(
    v_acct.id, v_alloc.event_id, 'payout_debit', v_payout.amount,
    v_new_bal, v_avail, v_alloc.id, p_payout_id
  );

  return jsonb_build_object(
    'status','completed','balance_after',v_new_bal,'available_after',v_avail
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- escrow_consistency_check
-- Returns any integrity violations. Run periodically or on-demand.
-- ─────────────────────────────────────────────────────────────
create or replace function escrow_consistency_check(
  p_event_id uuid
) returns jsonb language plpgsql security definer as $$
declare
  v_acct          escrow_accounts;
  v_sum_credits   numeric;
  v_sum_debits    numeric;
  v_sum_alloc     numeric;
  v_expected_bal  numeric;
  v_issues        jsonb := '[]';
begin
  select * into v_acct from escrow_accounts where event_id = p_event_id;
  if not found then return jsonb_build_object('ok',true,'message','No escrow account'); end if;

  select coalesce(sum(amount),0) into v_sum_credits
  from escrow_transactions where event_id = p_event_id and type = 'credit';

  select coalesce(sum(amount),0) into v_sum_debits
  from escrow_transactions where event_id = p_event_id and type = 'payout_debit';

  select coalesce(sum(amount),0) into v_sum_alloc
  from vendor_allocations
  where event_id = p_event_id and status in ('pending','approved');

  v_expected_bal := v_sum_credits - v_sum_debits;

  if abs(v_acct.balance - v_expected_bal) > 0.01 then
    v_issues := v_issues || jsonb_build_object(
      'type','balance_mismatch',
      'stored', v_acct.balance,
      'expected', v_expected_bal
    );
  end if;

  if abs(v_acct.total_allocated - v_sum_alloc) > 0.01 then
    v_issues := v_issues || jsonb_build_object(
      'type','allocation_mismatch',
      'stored', v_acct.total_allocated,
      'expected', v_sum_alloc
    );
  end if;

  return jsonb_build_object(
    'ok', jsonb_array_length(v_issues) = 0,
    'issues', v_issues,
    'balance', v_acct.balance,
    'total_allocated', v_acct.total_allocated,
    'available', v_acct.balance - v_acct.total_allocated
  );
end;
$$;
