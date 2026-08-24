-- ============================================================================
-- EmpireGuichet — Correctif : "Valider le départ" / "Refuser" ne faisait rien
--
-- Cause : la règle de sécurité (RLS) sur la mise à jour de
-- agency_transfer_requests exigeait status = 'pending', mais en Postgres,
-- quand une policy UPDATE n'a pas de clause WITH CHECK explicite, la clause
-- USING sert aussi de vérification APRÈS la modification. Comme le nouveau
-- statut n'est plus 'pending' une fois approuvé/refusé, la règle se
-- contredisait elle-même et bloquait silencieusement le changement.
-- À exécuter dans Supabase → SQL Editor
-- ============================================================================

drop policy if exists "ancien chef valide ou refuse" on agency_transfer_requests;
create policy "ancien chef valide ou refuse"
  on agency_transfer_requests for update
  using (
    status = 'pending'
    and exists (
      select 1 from agents a
      where a.id = auth.uid() and a.role = 'manager' and a.agency_id = agency_transfer_requests.old_agency_id
    )
  )
  with check (
    exists (
      select 1 from agents a
      where a.id = auth.uid() and a.role = 'manager' and a.agency_id = agency_transfer_requests.old_agency_id
    )
  );
