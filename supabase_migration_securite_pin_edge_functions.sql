-- ============================================================
-- Sécurité du PIN — à exécuter APRÈS le déploiement des Edge
-- Functions verify-pin et set-pin.
-- ============================================================

-- 1) Statut du PIN sans jamais exposer le hash au client.
--    Le front (fetchAgentProfile) appelle supabase.rpc('get_pin_status')
--    pour savoir si l'agent connecté a déjà un PIN sécurisé (bcrypt) ou
--    un ancien PIN en clair à migrer — sans jamais lire pin_hash lui-même.
create or replace function public.get_pin_status()
returns table (has_valid_pin boolean, has_legacy_pin boolean)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(pin_hash ~ '^\$2[aby]\$', false) as has_valid_pin,
    coalesce(pin_hash is not null and pin_hash !~ '^\$2[aby]\$', false) as has_legacy_pin
  from public.agents
  where id = auth.uid()
$$;

revoke all on function public.get_pin_status() from public;
grant execute on function public.get_pin_status() to authenticated;

-- 2) Défense en profondeur : seules les Edge Functions (clé service_role,
--    qui contourne RLS et les droits de colonne) doivent pouvoir lire ou
--    écrire pin_hash. On retire ce droit direct au rôle "authenticated"
--    (celui utilisé par le client via l'API REST / supabase-js).
--
--    ⚠️ IMPORTANT avant d'exécuter cette ligne : vérifie qu'AUCUNE requête
--    côté client ne fait plus `.select("*")` (ou `.select("...pin_hash...")`)
--    ni `.update({ pin_hash: ... })` sur la table agents. Le App.jsx fourni
--    a déjà été corrigé pour les 3 endroits identifiés (fetchAgentProfile,
--    loadPendingKycAgents, loadPendingManagers) — si tu as d'autres écrans
--    personnalisés qui lisent agents avec "*", corrige-les d'abord ou
--    cette ligne cassera leur affichage (PostgreSQL refuse un SELECT *
--    dès qu'une colonne référencée n'est pas autorisée).
revoke select (pin_hash), update (pin_hash) on public.agents from authenticated;
