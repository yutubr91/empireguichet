-- ============================================================================
-- Paiement réel des publicités : USDT BEP20 (automatique) ou Wave (validation par le propriétaire)
-- À exécuter UNE FOIS dans Supabase -> SQL Editor.
-- Corrige aussi la faille : un agent ne peut plus créer lui-même une publicité « active » ou « payée ».
-- ============================================================================

-- 1. Prix des publicités : source unique de vérité, côté base (7 j / 15 j / 30 j)
create or replace function public.ad_price_fcfa(p_days integer)
returns integer
language sql
immutable
as $$
  select case p_days when 7 then 15000 when 15 then 25000 when 30 then 40000 else null end;
$$;

-- 2. Table des paiements de publicités
create table if not exists public.ad_payments (
  id                uuid primary key default gen_random_uuid(),
  ad_id             uuid not null references public.ads(id) on delete cascade,
  agent_id          uuid not null references public.agents(id),
  amount            integer not null check (amount > 0),
  method            text not null check (method in ('usdt_bep20', 'wave')),
  status            text not null default 'pending' check (status in ('pending', 'validated', 'rejected')),
  payment_reference text,
  usdt_expected     numeric(18,4),
  pay_to_address    text,
  tx_hash           text,
  verified_at       timestamptz,
  rejected_reason   text,
  created_at        timestamptz not null default now(),
  decided_at        timestamptz
);

create unique index if not exists ad_payments_tx_hash_uniq
  on public.ad_payments (lower(tx_hash)) where tx_hash is not null;
create unique index if not exists ad_payments_usdt_amount_pending_uniq
  on public.ad_payments (usdt_expected) where status = 'pending' and method = 'usdt_bep20' and tx_hash is null;
create index if not exists ad_payments_ad_idx on public.ad_payments (ad_id);
create index if not exists ad_payments_agent_idx on public.ad_payments (agent_id);

alter table public.ad_payments enable row level security;

drop policy if exists "ad_payments_select_own" on public.ad_payments;
create policy "ad_payments_select_own" on public.ad_payments
  for select to authenticated using (agent_id = auth.uid());

drop policy if exists "ad_payments_select_owner" on public.ad_payments;
create policy "ad_payments_select_owner" on public.ad_payments
  for select to authenticated using (get_is_platform_owner());

-- Aucune politique INSERT/UPDATE/DELETE : seuls le serveur (service_role) et les fonctions ci-dessous écrivent ici.
grant select on public.ad_payments to authenticated;
grant all on public.ad_payments to service_role;

-- 3. Activation d'une publicité après paiement confirmé (interne)
create or replace function public.activate_ad_after_payment(p_payment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pay public.ad_payments%rowtype;
  v_ad  public.ads%rowtype;
begin
  select * into v_pay from public.ad_payments where id = p_payment_id for update;
  if not found then raise exception 'Paiement introuvable'; end if;
  if v_pay.status = 'validated' then return; end if;
  if v_pay.status <> 'pending' then raise exception 'Paiement non actif'; end if;

  select * into v_ad from public.ads where id = v_pay.ad_id for update;
  if not found then raise exception 'Publicité introuvable'; end if;
  if v_ad.kind <> 'publicite' or v_ad.status <> 'pending_payment' then
    raise exception 'Publicité non éligible à l''activation';
  end if;
  if public.ad_price_fcfa(v_ad.duration_days) is distinct from v_pay.amount then
    raise exception 'Montant incohérent avec le tarif';
  end if;

  update public.ad_payments set status = 'validated', decided_at = now() where id = v_pay.id;
  update public.ads
     set status = 'active',
         amount_paid = v_pay.amount,
         starts_at = now(),
         ends_at = now() + make_interval(days => v_ad.duration_days)
   where id = v_ad.id;
end;
$$;

revoke all on function public.activate_ad_after_payment(uuid) from public, anon, authenticated;
grant execute on function public.activate_ad_after_payment(uuid) to service_role;

-- 4. Wave : l'agent déclare son paiement (montant calculé côté base, jamais envoyé par le client)
create or replace function public.declare_ad_wave_payment(p_ad_id uuid, p_reference text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ad public.ads%rowtype;
  v_price integer;
  v_id uuid;
begin
  if auth.uid() is null then raise exception 'Non authentifié'; end if;
  if coalesce(trim(p_reference), '') = '' then raise exception 'Référence de paiement requise'; end if;

  select * into v_ad from public.ads where id = p_ad_id;
  if not found or v_ad.created_by <> auth.uid() then raise exception 'Publicité introuvable'; end if;
  if v_ad.kind <> 'publicite' or v_ad.status <> 'pending_payment' then
    raise exception 'Cette publicité n''attend pas de paiement';
  end if;
  v_price := public.ad_price_fcfa(v_ad.duration_days);
  if v_price is null then raise exception 'Durée non tarifée'; end if;

  if exists (select 1 from public.ad_payments where ad_id = p_ad_id and method = 'wave' and status = 'pending') then
    raise exception 'Un paiement Wave est déjà en attente de validation pour cette publicité';
  end if;

  insert into public.ad_payments (ad_id, agent_id, amount, method, status, payment_reference)
  values (p_ad_id, auth.uid(), v_price, 'wave', 'pending', trim(p_reference))
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.declare_ad_wave_payment(uuid, text) from public, anon;
grant execute on function public.declare_ad_wave_payment(uuid, text) to authenticated;

-- 5. Wave : le propriétaire valide ou refuse
create or replace function public.validate_ad_payment(p_payment_id uuid, p_approve boolean, p_reject_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not get_is_platform_owner() then
    raise exception 'Réservé au propriétaire de la plateforme';
  end if;
  if p_approve then
    perform public.activate_ad_after_payment(p_payment_id);
  else
    update public.ad_payments
       set status = 'rejected', rejected_reason = coalesce(p_reject_reason, 'Paiement non valide'), decided_at = now()
     where id = p_payment_id and status = 'pending';
  end if;
end;
$$;

revoke all on function public.validate_ad_payment(uuid, boolean, text) from public, anon;
grant execute on function public.validate_ad_payment(uuid, boolean, text) to authenticated;

-- 6. FAILLE CORRIGÉE : règles d'insertion des publicités
-- Un agent ne peut créer qu'une publicité "en attente de paiement" (jamais "active", jamais "payée").
-- Le propriétaire garde sa règle ads_insert_owner (publication gratuite).
drop policy if exists "createur cree ses pubs" on public.ads;
drop policy if exists "Créer sa pub" on public.ads;
drop policy if exists "ads_insert_agent_pending" on public.ads;
create policy "ads_insert_agent_pending" on public.ads
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and kind = 'publicite'
    and status = 'pending_payment'
    and amount_paid = 0
    and public.ad_price_fcfa(duration_days) is not null
  );
