-- ============================================================================
-- EmpireGuichet — Solde calculé des puces + rapprochement
-- À exécuter dans Supabase → SQL Editor, APRÈS supabase_migration_comptes_agents.sql
--
-- Principe : EmpireGuichet ne lit JAMAIS le solde réel d'une puce (aucune API opérateur).
-- Le solde affiché est un CALCUL :
--     solde de départ saisi par le chef
--   + retraits (le client envoie de l'argent électronique sur la puce)
--   − dépôts   (la puce envoie de l'argent électronique au client)
--   + ajustements validés par le chef après rapprochement
-- Seules les transactions « Terminé » faites avec cette puce APRÈS la date du solde de départ comptent.
-- Les frais / commissions ne sont pas enregistrés par transaction : ils ne sont pas inclus.
-- Rien n'est supprimé : ce script ajoute des colonnes, une table et des fonctions.
-- ============================================================================

-- 1. Solde de départ (nul = pas encore saisi, pour les puces reliées avant cette migration)
alter table agency_linked_accounts
  add column if not exists opening_balance numeric(14,0) check (opening_balance is null or opening_balance >= 0),
  add column if not exists opening_balance_at timestamptz;

-- Date du solde de départ posée par le serveur (pas de date antidatée), et solde de départ non modifiable une fois saisi
create or replace function trg_linked_account_opening_guard() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.opening_balance is not null then
      new.opening_balance_at := now();
    else
      new.opening_balance_at := null;
    end if;
  else
    if old.opening_balance is not null then
      new.opening_balance := old.opening_balance;
      new.opening_balance_at := old.opening_balance_at;
    elsif new.opening_balance is not null then
      new.opening_balance_at := now();
    end if;
  end if;
  return new;
end $$;

drop trigger if exists linked_account_opening_guard on agency_linked_accounts;
create trigger linked_account_opening_guard
  before insert or update on agency_linked_accounts
  for each row execute function trg_linked_account_opening_guard();

-- 2. Journal des rapprochements (traçabilité)
create table if not exists linked_account_reconciliations (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references agency_linked_accounts(id) on delete cascade,
  agency_id uuid not null references agencies(id) on delete cascade,
  calculated_balance numeric(14,0) not null,   -- solde calculé par l'application au moment du rapprochement
  real_balance numeric(14,0) not null check (real_balance >= 0),  -- solde lu par le chef sur son téléphone
  gap numeric(14,0) not null,                  -- réel − calculé
  applied boolean not null default false,      -- true = ajustement validé (compte dans le solde calculé)
  note text check (note is null or char_length(note) <= 200),
  created_by uuid references agents(id),
  created_at timestamptz not null default now()
);
create index if not exists linked_account_reconciliations_account_idx
  on linked_account_reconciliations(account_id, created_at desc);

alter table linked_account_reconciliations enable row level security;

drop policy if exists "chef lit les rapprochements de son agence" on linked_account_reconciliations;
create policy "chef lit les rapprochements de son agence"
  on linked_account_reconciliations for select
  using (exists (
    select 1 from agents a
    where a.id = auth.uid() and a.role = 'manager' and a.agency_id = linked_account_reconciliations.agency_id
  ));

-- Pas d'insert/update/delete direct : tout passe par les fonctions ci-dessous (journal non modifiable)
revoke insert, update, delete on linked_account_reconciliations from authenticated;
grant select on linked_account_reconciliations to authenticated;

-- 3. Soldes calculés des puces d'une agence (réservé au chef de cette agence)
create or replace function get_linked_account_balances(p_agency uuid)
returns table (
  account_id uuid,
  opening_balance numeric,
  opening_balance_at timestamptz,
  tx_net numeric,
  adjustments numeric,
  calculated_balance numeric
)
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from agents where id = auth.uid() and role = 'manager' and agency_id = p_agency) then
    raise exception 'Accès refusé';
  end if;

  return query
  select
    l.id,
    l.opening_balance,
    l.opening_balance_at,
    coalesce(t.net, 0),
    coalesce(r.adj, 0),
    case when l.opening_balance is null then null
         else l.opening_balance + coalesce(t.net, 0) + coalesce(r.adj, 0) end
  from agency_linked_accounts l
  left join lateral (
    select sum(case when tx.direction = 'retrait' then tx.amount else -tx.amount end) as net
    from transactions tx
    where tx.linked_account_id = l.id
      and tx.status = 'Terminé'
      and l.opening_balance_at is not null
      and tx.created_at >= l.opening_balance_at
  ) t on true
  left join lateral (
    select sum(rc.gap) as adj
    from linked_account_reconciliations rc
    where rc.account_id = l.id and rc.applied
  ) r on true
  where l.agency_id = p_agency;
end $$;

revoke all on function get_linked_account_balances(uuid) from public;
grant execute on function get_linked_account_balances(uuid) to authenticated;

-- 4. Solde de départ d'une puce reliée avant cette migration (une seule fois)
create or replace function set_linked_account_opening_balance(p_account uuid, p_amount numeric)
returns void
language plpgsql security definer set search_path = public as $$
declare v_agency uuid;
begin
  if p_amount is null or p_amount < 0 then raise exception 'Montant invalide'; end if;
  select agency_id into v_agency from agency_linked_accounts where id = p_account;
  if v_agency is null or not exists (
    select 1 from agents where id = auth.uid() and role = 'manager' and agency_id = v_agency
  ) then
    raise exception 'Accès refusé';
  end if;
  update agency_linked_accounts
     set opening_balance = round(p_amount)
   where id = p_account and opening_balance is null;
  if not found then raise exception 'Le solde de départ est déjà saisi'; end if;
end $$;

revoke all on function set_linked_account_opening_balance(uuid, numeric) from public;
grant execute on function set_linked_account_opening_balance(uuid, numeric) to authenticated;

-- 5. Rapprochement : le chef saisit le solde réel ; l'écart est journalisé ; l'ajustement est facultatif
create or replace function reconcile_linked_account(
  p_account uuid, p_real_balance numeric, p_apply boolean default false, p_note text default null
)
returns table (calculated_balance numeric, real_balance numeric, gap numeric, applied boolean)
language plpgsql security definer set search_path = public as $$
declare
  v_agency uuid;
  v_calc numeric;
  v_real numeric := round(p_real_balance);
  v_gap numeric;
begin
  if p_real_balance is null or p_real_balance < 0 then raise exception 'Montant invalide'; end if;
  select agency_id into v_agency from agency_linked_accounts where id = p_account;
  if v_agency is null or not exists (
    select 1 from agents where id = auth.uid() and role = 'manager' and agency_id = v_agency
  ) then
    raise exception 'Accès refusé';
  end if;

  select b.calculated_balance into v_calc
  from get_linked_account_balances(v_agency) b where b.account_id = p_account;
  if v_calc is null then raise exception 'Saisis d''abord le solde de départ de cette puce'; end if;

  v_gap := v_real - v_calc;
  insert into linked_account_reconciliations
    (account_id, agency_id, calculated_balance, real_balance, gap, applied, note, created_by)
  values
    (p_account, v_agency, v_calc, v_real, v_gap, coalesce(p_apply, false) and v_gap <> 0, left(p_note, 200), auth.uid());

  return query select v_calc, v_real, v_gap, (coalesce(p_apply, false) and v_gap <> 0);
end $$;

revoke all on function reconcile_linked_account(uuid, numeric, boolean, text) from public;
grant execute on function reconcile_linked_account(uuid, numeric, boolean, text) to authenticated;
