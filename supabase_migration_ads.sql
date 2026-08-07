-- ============================================================
-- EmpireGuichet — Table "ads" (Espace annonceurs / publicités)
-- À exécuter dans Supabase → SQL Editor
-- ============================================================

-- 1) Table
create table if not exists ads (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references agents(id) on delete cascade,
  agency_id uuid references agencies(id) on delete set null,
  agency_name text,
  title text not null,
  description text not null,
  contact_phone text not null,
  duration_days int not null,
  amount_paid numeric not null,
  status text not null default 'active', -- 'active' | 'rejected' | 'expired'
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  impressions int not null default 0,
  clicks int not null default 0,
  created_at timestamptz not null default now()
);

-- Index utiles pour les requêtes de l'appli
create index if not exists ads_status_ends_at_idx on ads (status, ends_at);
create index if not exists ads_created_by_idx on ads (created_by);

-- 2) Sécurité (RLS)
alter table ads enable row level security;

-- Tout agent/chef d'agence connecté peut voir les pubs actives et non expirées
drop policy if exists "Voir les pubs actives" on ads;
create policy "Voir les pubs actives"
on ads for select
to authenticated
using (status = 'active' and ends_at > now());

-- Chacun peut voir ses propres pubs (même expirées/rejetées) dans "Mes publicités"
drop policy if exists "Voir ses propres pubs" on ads;
create policy "Voir ses propres pubs"
on ads for select
to authenticated
using (created_by = auth.uid());

-- Le propriétaire de la plateforme voit TOUTES les pubs (backoffice)
drop policy if exists "Owner voit tout" on ads;
create policy "Owner voit tout"
on ads for select
to authenticated
using (
  exists (
    select 1 from agents
    where agents.id = auth.uid() and agents.is_platform_owner = true
  )
);

-- Un agent connecté peut créer sa propre pub (paiement simulé côté appli)
drop policy if exists "Créer sa pub" on ads;
create policy "Créer sa pub"
on ads for insert
to authenticated
with check (created_by = auth.uid());

-- Seul le propriétaire peut modifier une pub (ex. la désactiver)
drop policy if exists "Owner peut modifier" on ads;
create policy "Owner peut modifier"
on ads for update
to authenticated
using (
  exists (
    select 1 from agents
    where agents.id = auth.uid() and agents.is_platform_owner = true
  )
);

-- 3) Fonctions RPC pour incrémenter impressions/clics de façon atomique
create or replace function increment_ad_impression(ad_id_input uuid)
returns void
language sql
security definer
as $$
  update ads set impressions = coalesce(impressions, 0) + 1 where id = ad_id_input;
$$;

create or replace function increment_ad_click(ad_id_input uuid)
returns void
language sql
security definer
as $$
  update ads set clicks = coalesce(clicks, 0) + 1 where id = ad_id_input;
$$;

grant execute on function increment_ad_impression(uuid) to authenticated;
grant execute on function increment_ad_click(uuid) to authenticated;
