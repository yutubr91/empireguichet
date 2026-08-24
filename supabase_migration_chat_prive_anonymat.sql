-- ============================================================================
-- EmpireGuichet — Anonymat + messages privés chef ↔ agent dans la discussion
-- À exécuter dans Supabase → SQL Editor (après les migrations précédentes)
-- ============================================================================

-- 1) Préférence d'affichage du nom réel dans la discussion (par défaut : caché)
alter table agents add column if not exists chat_show_real_name boolean default false;

-- 2) Destinataire optionnel : null = message public, sinon = message privé
alter table chat_messages add column if not exists recipient_id uuid references agents(id) on delete cascade;
create index if not exists chat_messages_recipient_idx on chat_messages(recipient_id);

-- 3) Nouvelles règles de lecture : un message public est visible par tous les
-- agents connectés ; un message privé n'est visible que par son expéditeur et
-- son destinataire.
drop policy if exists "tout agent connecte lit le chat" on chat_messages;
create policy "lecture chat public et messages prives concernes"
  on chat_messages for select
  using (
    recipient_id is null
    or auth.uid() = agent_id
    or auth.uid() = recipient_id
  );

-- 4) Nouvelle règle d'écriture : un message public est libre ; un message
-- privé n'est autorisé qu'entre un chef d'agence et UN agent de SA PROPRE
-- agence (dans un sens ou dans l'autre) — jamais agent-agent ni chef-chef.
-- 4) Fonction "de confiance" (SECURITY DEFINER) qui vérifie si l'expéditeur
-- a le droit d'envoyer un message privé à target_id : ils doivent être dans
-- la même agence, l'un chef d'agence et l'autre agent simple. On passe par
-- une fonction plutôt qu'un test direct dans la policy, car un test direct
-- s'exécute avec les droits de lecture de l'expéditeur sur la table agents
-- (souvent limités à sa propre ligne), ce qui bloquerait à tort les agents
-- simples qui écrivent à leur chef.
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

drop policy if exists "tout agent connecte ecrit dans le chat" on chat_messages;
drop policy if exists "ecriture chat public ou prive chef-agent" on chat_messages;
create policy "ecriture chat public ou prive chef-agent"
  on chat_messages for insert
  with check (
    auth.uid() = agent_id
    and (recipient_id is null or can_private_message(recipient_id))
  );

-- 5) Fonction pour qu'un agent simple retrouve le chef de sa propre agence
-- (utilisée pour démarrer une conversation privée avec lui).
create or replace function get_my_manager()
returns table(id uuid, full_name text, phone text)
language sql
security definer
as $$
  select a.id, a.full_name, a.phone
  from agents a
  where a.agency_id = (select agency_id from agents where id = auth.uid())
    and a.role = 'manager'
    and a.id <> auth.uid()
  limit 1;
$$;

grant execute on function get_my_manager() to authenticated;

-- ============================================================================
-- Fin de la migration
-- ============================================================================
