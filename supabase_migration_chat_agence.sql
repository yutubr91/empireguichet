-- ============================================================================
-- Cantonne la Discussion (chat_messages) à l'agence de chacun : un chef
-- d'agence ne voit et n'échange qu'avec SES agents, pas ceux des autres
-- agences. À exécuter dans l'éditeur SQL de Supabase.
-- ============================================================================

-- 1) Nouvelle colonne : à quelle agence appartient chaque message
alter table chat_messages add column if not exists agency_id uuid references agencies(id);

-- 2) Rattrapage : on déduit l'agence des messages déjà envoyés à partir de
--    l'agence actuelle de leur auteur
update chat_messages cm
set agency_id = a.agency_id
from agents a
where cm.agent_id = a.id
  and cm.agency_id is null;

-- 3) Nouvelles politiques : on ne lit / écrit que dans le chat de sa propre agence
drop policy if exists "tout agent connecte lit le chat" on chat_messages;
drop policy if exists "lit uniquement le chat de sa propre agence" on chat_messages;
create policy "lit uniquement le chat de sa propre agence"
  on chat_messages for select
  using (
    agency_id = (select agency_id from agents where id = auth.uid())
  );

drop policy if exists "tout agent connecte ecrit dans le chat" on chat_messages;
drop policy if exists "ecrit uniquement dans le chat de sa propre agence" on chat_messages;
create policy "ecrit uniquement dans le chat de sa propre agence"
  on chat_messages for insert
  with check (
    auth.uid() = agent_id
    and agency_id = (select agency_id from agents where id = auth.uid())
  );
