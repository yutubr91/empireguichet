-- ============================================================================
-- EmpireGuichet — Sécurisation de la récupération de mot de passe
--
-- Contexte : l'écran "mot de passe oublié" (avant connexion) faisait
--   supabase.from("agents").select("email").eq("phone", fullPhone)
-- directement depuis le client. Comme cet écran s'affiche AVANT
-- authentification, cette requête tourne avec le rôle "anon" (la clé anon
-- Supabase est publique, présente dans le bundle JS envoyé à tout visiteur).
-- N'importe qui peut donc interroger l'API REST Supabase directement avec
-- des numéros de téléphone devinés et récupérer l'e-mail associé à chaque
-- compte existant — une fuite de données personnelles à grande échelle,
-- sans même passer par l'app.
--
-- Correctif : une fonction SECURITY DEFINER qui compare téléphone + e-mail
-- côté serveur et ne renvoie qu'un booléen — jamais l'e-mail lui-même.
-- À exécuter dans Supabase → SQL Editor
-- ============================================================================

create or replace function public.check_recovery_match(p_phone text, p_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from agents
    where phone = p_phone
      and lower(trim(email)) = lower(trim(p_email))
  );
$$;

-- Doit être appelable AVANT connexion (l'utilisateur a justement perdu
-- l'accès à son compte) : on autorise donc "anon" en plus de
-- "authenticated". La fonction ne renvoie jamais de données, juste un
-- booléen, donc ça ne réintroduit aucune fuite.
grant execute on function public.check_recovery_match(text, text) to anon, authenticated;

-- ⚠️ Si une règle RLS "select" a été ajoutée spécifiquement pour permettre
-- cette ancienne requête (à "anon" ou trop largement à "authenticated"),
-- retire-la maintenant qu'elle n'est plus nécessaire — regarde la liste des
-- règles actuelles avec :
--   select polname, polcmd, pg_get_expr(polqual, polrelid) as using_expr
--   from pg_policy where polrelid = 'public.agents'::regclass;
-- puis "drop policy" celle qui exposait email/phone à anon, si elle existe.

-- ============================================================================
-- Fin de la migration
-- ============================================================================
