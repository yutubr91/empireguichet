-- ============================================================================
-- EmpireGuichet — Sécurisation de la validation/refus KYC + verrou des
-- colonnes sensibles de la table agents (role, is_platform_owner, agency_id,
-- kyc_status...)
--
-- Contexte : approveKycAgent()/rejectKycAgent() dans App.jsx faisaient un
-- .update({ kyc_status: ... }) DIRECT depuis le client, en s'appuyant
-- uniquement sur la RLS de la table agents pour empêcher :
--   - un agent de valider/refuser son propre dossier
--   - un agent hors de l'agence concernée d'agir dessus
--   - un agent de se donner lui-même role='manager' ou is_platform_owner=true
-- en modifiant sa propre ligne directement via l'API Supabase.
--
-- Cette migration reprend le pattern déjà utilisé pour le transfert
-- d'agence et la résolution de doublon d'identité : une fonction
-- SECURITY DEFINER qui vérifie explicitement qui a le droit de faire quoi,
-- puis un verrou de colonnes en défense en profondeur.
-- À exécuter dans Supabase → SQL Editor
-- ============================================================================

-- 1) Validation d'un dossier KYC
create or replace function public.validate_kyc(p_agent_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller record;
  v_target record;
begin
  select role, agency_id, coalesce(is_platform_owner, false) as is_platform_owner
    into v_caller from agents where id = auth.uid();
  select id, role, agency_id into v_target from agents where id = p_agent_id;

  if v_target.id is null then
    raise exception 'Agent introuvable';
  end if;
  if v_target.id = auth.uid() then
    raise exception 'Impossible de valider son propre dossier';
  end if;

  if v_target.role = 'manager' then
    -- Un chef d'agence n'est validé que par le propriétaire de la plateforme.
    if not v_caller.is_platform_owner then
      raise exception 'Action réservée au propriétaire de la plateforme';
    end if;
  else
    -- Un agent simple est validé par le chef de SA propre agence, ou le
    -- propriétaire.
    if not (
      v_caller.is_platform_owner
      or (v_caller.role = 'manager' and v_caller.agency_id = v_target.agency_id)
    ) then
      raise exception 'Action non autorisée';
    end if;
  end if;

  update agents set kyc_status = 'validated' where id = p_agent_id;
end;
$$;

grant execute on function public.validate_kyc(uuid) to authenticated;

-- 2) Refus d'un dossier KYC (mêmes règles d'autorisation que ci-dessus)
create or replace function public.reject_kyc(p_agent_id uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller record;
  v_target record;
begin
  select role, agency_id, coalesce(is_platform_owner, false) as is_platform_owner
    into v_caller from agents where id = auth.uid();
  select id, role, agency_id into v_target from agents where id = p_agent_id;

  if v_target.id is null then
    raise exception 'Agent introuvable';
  end if;
  if v_target.id = auth.uid() then
    raise exception 'Impossible de refuser son propre dossier';
  end if;

  if v_target.role = 'manager' then
    if not v_caller.is_platform_owner then
      raise exception 'Action réservée au propriétaire de la plateforme';
    end if;
  else
    if not (
      v_caller.is_platform_owner
      or (v_caller.role = 'manager' and v_caller.agency_id = v_target.agency_id)
    ) then
      raise exception 'Action non autorisée';
    end if;
  end if;

  update agents
    set kyc_status = 'rejected',
        kyc_rejected_reason = coalesce(nullif(trim(p_reason), ''), 'Documents non conformes')
    where id = p_agent_id;
end;
$$;

grant execute on function public.reject_kyc(uuid, text) to authenticated;

-- ============================================================================
-- 3) Défense en profondeur : même avec les fonctions ci-dessus, on retire
--    au client tout accès UPDATE direct sur les colonnes qui déterminent le
--    contrôle du compte. Ainsi, même un bug futur (un .update() ajouté par
--    erreur sur ces colonnes) sera bloqué par Postgres, pas seulement par
--    la RLS ou par la discipline du code applicatif.
--
--    Les fonctions SECURITY DEFINER ci-dessus, comme celles déjà existantes
--    (apply_agency_transfer, resolve_identity_duplicate), continuent de
--    fonctionner : elles s'exécutent avec les droits du propriétaire de la
--    fonction, pas ceux du rôle "authenticated".
--
--    ⚠️ Comme pour pin_hash : vérifie d'abord qu'aucun autre écran ne fait
--    encore un .update() direct sur role / is_platform_owner / agency_id /
--    agency_name / kyc_status / kyc_rejected_reason / identity_override
--    avant d'exécuter cette ligne.
revoke update (
  role, is_platform_owner, agency_id, agency_name,
  kyc_status, kyc_rejected_reason, identity_override
) on public.agents from authenticated;

-- ============================================================================
-- Fin de la migration
-- ============================================================================
