-- ============================================================================
-- EmpireGuichet — Paiement automatique de l'abonnement en USDT (BEP20)
-- À exécuter dans Supabase → SQL Editor.
--
-- AVANT de lancer ce script, exécute la requête de vérification donnée dans le chat
-- (règles de sécurité actuelles + fonction auth.uid()).
--
-- Ce script ne supprime aucune donnée. Il :
--  1. ajoute des colonnes à subscription_payments (méthode, montant USDT attendu, adresse, hash, date de vérification) ;
--  2. empêche qu'un même numéro de transaction serve deux fois, et que deux demandes en attente aient le même montant ;
--  3. crée la fonction interne auto_validate_subscription_payment, réservée au serveur (service_role) : elle
--     réutilise EXACTEMENT ta fonction validate_subscription_payment (même logique de prolongation, même
--     déclencheur de commission de parrainage) ;
--  4. SÉCURITÉ : empêche un utilisateur de créer lui-même une ligne « USDT » ou « validée » : seuls le serveur
--     et le propriétaire peuvent le faire. (La règle sur la création d'abonnement est déjà correcte dans ta base :
--     ce script n'y touche pas.)
-- ============================================================================

-- 1. Colonnes
alter table subscription_payments
  add column if not exists payment_method text,
  add column if not exists usdt_expected numeric(18, 4),
  add column if not exists pay_to_address text,
  add column if not exists tx_hash text,
  add column if not exists verified_at timestamptz;

alter table subscription_payments drop constraint if exists subscription_payments_payment_method_check;
alter table subscription_payments
  add constraint subscription_payments_payment_method_check
  check (payment_method is null or payment_method in ('usdt_bep20'));

-- 2. Un numéro de transaction ne sert qu'une fois ; un montant USDT n'est réservé qu'à une demande en attente
create unique index if not exists subscription_payments_tx_hash_key
  on subscription_payments (lower(tx_hash)) where tx_hash is not null;

create unique index if not exists subscription_payments_usdt_pending_amount_key
  on subscription_payments (pay_to_address, usdt_expected)
  where status = 'pending' and payment_method = 'usdt_bep20';

-- 3. Activation automatique (appelée uniquement par la fonction serveur, avec la clé service_role)
create or replace function auto_validate_subscription_payment(p_payment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  select id into v_owner from agents where coalesce(is_platform_owner, false) = true order by id limit 1;
  if v_owner is null then
    raise exception 'Aucun propriétaire de plateforme configuré';
  end if;

  -- Dans cette seule transaction, on agit « en tant que » propriétaire pour réutiliser validate_subscription_payment
  -- sans copier sa logique (si tu la modifies un jour, l'activation automatique suit).
  perform set_config('request.jwt.claim.sub', v_owner::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_owner::text, 'role', 'authenticated')::text, true);

  perform public.validate_subscription_payment(p_payment_id := p_payment_id, p_approve := true, p_reject_reason := null);
end;
$$;

revoke all on function auto_validate_subscription_payment(uuid) from public, anon, authenticated;
grant execute on function auto_validate_subscription_payment(uuid) to service_role;

-- 4. SÉCURITÉ — paiements : un utilisateur ne peut déclarer qu'un paiement « en attente » aux montants fixes,
-- sans les champs réservés au serveur (méthode USDT, montant USDT, adresse, hash, date de vérification).
-- Cette règle reprend celle déjà présente dans ta base (statut « pending », validated_at vide, montants 2500 / 200)
-- et y ajoute les nouvelles colonnes.
drop policy if exists "agent declare un paiement" on subscription_payments;
create policy "agent declare un paiement"
  on subscription_payments for insert
  with check (
    auth.uid() = agent_id
    and status = 'pending'
    and validated_at is null
    and rejected_reason is null
    and (
      (type = 'abonnement' and amount = 2500)
      or (type = 'historique' and amount = 200)
    )
    and payment_method is null
    and usdt_expected is null
    and pay_to_address is null
    and tx_hash is null
    and verified_at is null
    and created_at >= now() - interval '5 minutes'
    and created_at <= now() + interval '1 minute'
  );
