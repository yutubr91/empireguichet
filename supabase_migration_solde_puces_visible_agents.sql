-- ============================================================================
-- EmpireGuichet — L'agent simple voit (lecture seule) le solde des puces qui lui sont attribuées
-- À exécuter dans Supabase → SQL Editor, APRÈS supabase_migration_solde_puces_rapprochement.sql
--
-- Règles :
--   * le chef voit toutes les puces de son agence (inchangé) ;
--   * un agent voit uniquement les puces attribuées à lui, ou celles attribuées à personne (partagées) ;
--   * l'agent ne peut rien modifier : solde de départ et rapprochement restent réservés au chef.
-- Le solde reste un CALCUL (départ saisi par le chef + opérations − ajustements), pas une lecture de l'opérateur.
-- ============================================================================

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
declare
  v_is_manager boolean;
begin
  select (role = 'manager') into v_is_manager
  from agents where id = auth.uid() and agency_id = p_agency;

  if v_is_manager is null then
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
  where l.agency_id = p_agency
    and (
      v_is_manager
      or not exists (select 1 from agency_linked_account_agents x where x.account_id = l.id)
      or exists (select 1 from agency_linked_account_agents x where x.account_id = l.id and x.agent_id = auth.uid())
    );
end $$;

revoke all on function get_linked_account_balances(uuid) from public;
grant execute on function get_linked_account_balances(uuid) to authenticated;
