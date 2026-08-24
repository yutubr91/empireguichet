-- ============================================================================
-- EmpireGuichet — Changement de chef d'agence (avec validation de l'ancien chef)
-- À exécuter dans Supabase → SQL Editor
-- ============================================================================

create table if not exists agency_transfer_requests (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  old_agency_id uuid references agencies(id),
  new_agency_id uuid references agencies(id),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now(),
  decided_at timestamptz
);
create index if not exists agency_transfer_requests_old_agency_idx on agency_transfer_requests(old_agency_id);

alter table agency_transfer_requests enable row level security;

-- L'agent voit et crée ses propres demandes
drop policy if exists "agent lit ses demandes de transfert" on agency_transfer_requests;
create policy "agent lit ses demandes de transfert"
  on agency_transfer_requests for select
  using (auth.uid() = agent_id);

drop policy if exists "agent cree sa demande de transfert" on agency_transfer_requests;
create policy "agent cree sa demande de transfert"
  on agency_transfer_requests for insert
  with check (
    auth.uid() = agent_id
    and old_agency_id = (select agency_id from agents where id = auth.uid())
  );

-- L'ancien chef (celui de old_agency_id) voit et valide/refuse les demandes
-- de SES agents qui veulent partir.
drop policy if exists "ancien chef lit les demandes de son agence" on agency_transfer_requests;
create policy "ancien chef lit les demandes de son agence"
  on agency_transfer_requests for select
  using (
    exists (
      select 1 from agents a
      where a.id = auth.uid() and a.role = 'manager' and a.agency_id = agency_transfer_requests.old_agency_id
    )
  );

drop policy if exists "ancien chef valide ou refuse" on agency_transfer_requests;
create policy "ancien chef valide ou refuse"
  on agency_transfer_requests for update
  using (
    status = 'pending'
    and exists (
      select 1 from agents a
      where a.id = auth.uid() and a.role = 'manager' and a.agency_id = agency_transfer_requests.old_agency_id
    )
  );

grant select, insert, update on agency_transfer_requests to authenticated;

-- Quand l'ancien chef approuve, on bascule automatiquement l'agent vers sa
-- nouvelle agence (nécessite des droits élevés : l'ancien chef ne devrait
-- normalement pas pouvoir modifier lui-même la ligne d'un agent).
create or replace function apply_agency_transfer()
returns trigger as $$
begin
  if new.status = 'approved' and old.status = 'pending' then
    update agents set agency_id = new.new_agency_id where id = new.agent_id;
    new.decided_at = now();
  elsif new.status = 'rejected' and old.status = 'pending' then
    new.decided_at = now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_apply_agency_transfer on agency_transfer_requests;
create trigger trg_apply_agency_transfer
  before update on agency_transfer_requests
  for each row execute function apply_agency_transfer();

-- ============================================================================
-- Fin de la migration
-- ============================================================================
