-- ============================================================================
-- EmpireGuichet — Persister l'état "lu / non lu" des messages privés
-- (sans ça, la pastille de notification se remet à zéro à chaque
-- rechargement de la page, même s'il reste de vrais messages non lus)
-- À exécuter dans Supabase → SQL Editor
-- ============================================================================

alter table chat_messages add column if not exists read_at timestamptz;

-- Le destinataire d'un message peut marquer SES messages reçus comme lus
-- (jamais ceux des autres, jamais ses propres messages envoyés).
drop policy if exists "destinataire marque comme lu" on chat_messages;
create policy "destinataire marque comme lu"
  on chat_messages for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

grant update on chat_messages to authenticated;
