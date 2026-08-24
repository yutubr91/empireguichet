-- ============================================================================
-- EmpireGuichet — Correctif : les agents simples ne pouvaient pas envoyer de
-- message privé à leur chef d'agence.
--
-- Cause : la règle de sécurité (RLS) qui autorise l'envoi d'un message privé
-- vérifie "même agence, l'un chef et l'autre agent" en interrogeant la table
-- agents — mais cette vérification s'exécute avec les droits de la personne
-- qui écrit. Un agent simple n'a normalement le droit de lire que sa propre
-- ligne dans agents, donc la vérification échouait silencieusement pour lui
-- (alors qu'un chef d'agence, qui a plus de droits de lecture, y arrivait).
--
-- Correctif : on déplace cette vérification dans une fonction "de confiance"
-- (SECURITY DEFINER, même principe que get_team_members et get_my_manager
-- déjà en place), qui contourne cette restriction juste pour cette
-- vérification précise, sans donner d'accès supplémentaire ailleurs.
-- À exécuter dans Supabase → SQL Editor
-- ============================================================================

create or replace function can_private_message(target_id uuid)
returns boolean
language sql
security definer
as $$
  select exists (
    select 1
    from agents me, agents them
    where me.id = auth.uid()
      and them.id = target_id
      and me.agency_id = them.agency_id
      and me.id <> them.id
      and (
        (me.role = 'manager' and them.role = 'agent')
        or (me.role = 'agent' and them.role = 'manager')
      )
  );
$$;

grant execute on function can_private_message(uuid) to authenticated;

drop policy if exists "ecriture chat public ou prive chef-agent" on chat_messages;
create policy "ecriture chat public ou prive chef-agent"
  on chat_messages for insert
  with check (
    auth.uid() = agent_id
    and (recipient_id is null or can_private_message(recipient_id))
  );
