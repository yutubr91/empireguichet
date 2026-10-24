-- ============================================================================
-- EmpireGuichet — Comptes liés du chef d'agence (MTN, Orange, Moov, Wave, Djamo, crypto)
-- À exécuter dans Supabase → SQL Editor
--
-- L'application ne détient jamais d'argent : ces comptes servent uniquement à
-- identifier les numéros / adresses de l'agence et à suivre le volume par opérateur.
-- Le chef d'agence (role = 'manager') les relie ; les agents de la même agence les lisent.
-- ============================================================================

create table if not exists agency_linked_accounts (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies(id) on delete cascade,
  network text not null check (network in ('mtn', 'orange', 'moov', 'wave', 'djamo', 'crypto')),
  identifier text not null check (char_length(identifier) between 3 and 200),
  spi_address text check (spi_address is null or char_length(spi_address) between 3 and 80),
  qr_payload text check (qr_payload is null or char_length(qr_payload) <= 200),
  crypto_network text check (crypto_network is null or char_length(crypto_network) <= 20),
  linked_by uuid references agents(id),
  updated_at timestamptz default now(),
  unique (agency_id, network)
);
create index if not exists agency_linked_accounts_agency_idx on agency_linked_accounts(agency_id);

alter table agency_linked_accounts enable row level security;

-- Tous les membres de l'agence (chef + agents) lisent les comptes liés
drop policy if exists "membres de l'agence lisent les comptes lies" on agency_linked_accounts;
create policy "membres de l'agence lisent les comptes lies"
  on agency_linked_accounts for select
  using (
    exists (
      select 1 from agents a
      where a.id = auth.uid() and a.agency_id = agency_linked_accounts.agency_id
    )
  );

-- Seul le chef d'agence relie, modifie ou délie
drop policy if exists "chef relie les comptes de son agence" on agency_linked_accounts;
create policy "chef relie les comptes de son agence"
  on agency_linked_accounts for insert
  with check (
    exists (
      select 1 from agents a
      where a.id = auth.uid() and a.role = 'manager' and a.agency_id = agency_linked_accounts.agency_id
    )
  );

drop policy if exists "chef modifie les comptes de son agence" on agency_linked_accounts;
create policy "chef modifie les comptes de son agence"
  on agency_linked_accounts for update
  using (
    exists (
      select 1 from agents a
      where a.id = auth.uid() and a.role = 'manager' and a.agency_id = agency_linked_accounts.agency_id
    )
  )
  with check (
    exists (
      select 1 from agents a
      where a.id = auth.uid() and a.role = 'manager' and a.agency_id = agency_linked_accounts.agency_id
    )
  );

drop policy if exists "chef delie les comptes de son agence" on agency_linked_accounts;
create policy "chef delie les comptes de son agence"
  on agency_linked_accounts for delete
  using (
    exists (
      select 1 from agents a
      where a.id = auth.uid() and a.role = 'manager' and a.agency_id = agency_linked_accounts.agency_id
    )
  );

grant select, insert, update, delete on agency_linked_accounts to authenticated;
