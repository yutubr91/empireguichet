-- ============================================================================
-- EmpireGuichet — Correctif : la pastille "message privé non lu" restait
-- bloquée quand l'agent qui avait envoyé le message était ensuite promu
-- chef d'agence. Une fois promu, il disparaît de la liste d'équipe de son
-- ancien chef (get_team_members ne renvoie que les agents simples actuels),
-- qui n'a alors plus aucun moyen d'ouvrir cette conversation pour que le
-- message se marque comme lu — la notification restait donc coincée pour
-- toujours.
--
-- Correctif : une fonction qui renvoie, en plus de l'équipe actuelle, tout
-- agent ayant un message privé non lu adressé au chef connecté — même s'il
-- ne fait plus partie de son équipe aujourd'hui. Cela permet de rouvrir la
-- conversation, de la lire, et de laisser le mécanisme existant marquer les
-- messages comme lus normalement.
-- À exécuter dans Supabase → SQL Editor
-- ============================================================================

create or replace function get_unread_private_contacts()
returns table(id uuid, full_name text)
language sql
security definer
as $$
  select distinct a.id, a.full_name
  from chat_messages m
  join agents a on a.id = m.agent_id
  where m.recipient_id = auth.uid()
    and m.read_at is null;
$$;

grant execute on function get_unread_private_contacts() to authenticated;

-- ============================================================================
-- Fin de la migration
-- ============================================================================
