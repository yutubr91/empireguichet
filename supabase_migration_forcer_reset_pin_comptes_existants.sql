-- ============================================================================
-- EmpireGuichet — Forcer les comptes déjà existants à recréer leur PIN
--
-- Contexte : "Changer le code PIN" (qui exige l'ancien PIN) échoue avec un
-- message peu clair. Plutôt que de continuer à deviner pourquoi, on fait
-- passer tous les comptes déjà créés par le parcours de RÉINITIALISATION
-- (qui ne demande pas l'ancien PIN, déjà utilisé pour les anciens PIN en
-- clair) au prochain login — une seule fois.
-- À exécuter APRÈS la migration "supabase_migration_securite_pin_edge_functions.sql"
-- et APRÈS avoir mis à jour la Edge Function set-pin.
-- ============================================================================

alter table public.agents add column if not exists pin_reset_required boolean not null default false;

-- Tous les comptes qui ont déjà un PIN sécurisé (bcrypt) aujourd'hui devront
-- en recréer un nouveau à leur prochaine connexion.
update public.agents
  set pin_reset_required = true
  where pin_hash ~ '^\$2[aby]\$';

-- get_pin_status() renvoie maintenant aussi ce drapeau, sans jamais exposer
-- le hash lui-même.
create or replace function public.get_pin_status()
returns table (has_valid_pin boolean, has_legacy_pin boolean, pin_reset_required boolean)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(pin_hash ~ '^\$2[aby]\$', false) as has_valid_pin,
    coalesce(pin_hash is not null and pin_hash !~ '^\$2[aby]\$', false) as has_legacy_pin,
    coalesce(pin_reset_required, false) as pin_reset_required
  from public.agents
  where id = auth.uid()
$$;

grant execute on function public.get_pin_status() to authenticated;

-- ============================================================================
-- Fin de la migration
-- ============================================================================
