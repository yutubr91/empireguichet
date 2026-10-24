-- ============================================================================
-- EmpireGuichet — Attribution des numéros du chef à ses agents
-- (chaque agent a ses numéros ; certains numéros peuvent être partagés)
-- À exécuter dans Supabase → SQL Editor, APRÈS supabase_migration_comptes_lies_plusieurs.sql
--
-- AVANT de lancer ce script, exécute les requêtes de vérification données dans le chat.
--
-- Règle : un numéro sans aucune attribution est utilisable par TOUS les agents de l'agence ;
-- dès qu'au moins un agent lui est attribué, seuls les agents attribués (et le chef) l'utilisent.
-- Rien n'est supprimé : ce script ne fait qu'ajouter une table et une colonne.
-- ============================================================================

-- 1. Table d'attribution (plusieurs-à-plusieurs)
create table if not exists agency_linked_account_agents (
  account_id uuid not null references agency_linked_accounts(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  assigned_at timestamptz default now(),
  primary key (account_id, agent_id)
);
create index if not exists agency_linked_account_agents_agent_idx on agency_linked_account_agents(agent_id);

alter table agency_linked_account_agents enable row level security;

-- Les membres de l'agence lisent les attributions de leur agence (nécessaire pour savoir quels numéros sont partagés)
drop policy if exists "membres lisent les attributions de leur agence" on agency_linked_account_agents;
create policy "membres lisent les attributions de leur agence"
  on agency_linked_account_agents for select
  using (
    exists (
      select 1
      from agency_linked_accounts l
      join agents a on a.agency_id = l.agency_id
      where l.id = agency_linked_account_agents.account_id and a.id = auth.uid()
    )
  );

-- Seul le chef de l'agence attribue, et seulement à un agent de SA agence
drop policy if exists "chef attribue les numeros a ses agents" on agency_linked_account_agents;
create policy "chef attribue les numeros a ses agents"
  on agency_linked_account_agents for insert
  with check (
    exists (
      select 1
      from agency_linked_accounts l
      join agents m on m.agency_id = l.agency_id and m.id = auth.uid() and m.role = 'manager'
      where l.id = agency_linked_account_agents.account_id
    )
    and exists (
      select 1
      from agency_linked_accounts l
      join agents t on t.agency_id = l.agency_id
      where l.id = agency_linked_account_agents.account_id and t.id = agency_linked_account_agents.agent_id
    )
  );

-- Seul le chef retire une attribution
drop policy if exists "chef retire les attributions de ses numeros" on agency_linked_account_agents;
create policy "chef retire les attributions de ses numeros"
  on agency_linked_account_agents for delete
  using (
    exists (
      select 1
      from agency_linked_accounts l
      join agents m on m.agency_id = l.agency_id and m.id = auth.uid() and m.role = 'manager'
      where l.id = agency_linked_account_agents.account_id
    )
  );

grant select, insert, delete on agency_linked_account_agents to authenticated;

-- 2. Numéro de l'agence utilisé par chaque transaction (pour le volume par numéro)
alter table transactions
  add column if not exists linked_account_id uuid references agency_linked_accounts(id) on delete set null;
create index if not exists transactions_linked_account_idx on transactions(linked_account_id);
