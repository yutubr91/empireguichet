-- Correctif : nettoyage des annonces expirées (erreur « permission denied for table ads »)
-- À exécuter une fois dans Supabase -> SQL Editor.

-- 1. Retirer la règle ouverte aux visiteurs anonymes
drop policy if exists "delete_expired_ads_anyone" on public.ads;

-- 2. Autoriser uniquement les utilisateurs connectés, et seulement pour les annonces expirées
drop policy if exists "delete_expired_ads_authenticated" on public.ads;
create policy "delete_expired_ads_authenticated"
  on public.ads
  for delete
  to authenticated
  using (ends_at < now());

-- 3. Accorder le droit de base manquant
grant delete on public.ads to authenticated;
