-- ============================================================================
-- EmpireGuichet — Migration : Abonnements, Parrainage, Historique payant, Chat
-- À exécuter dans Supabase → SQL Editor (une seule fois)
-- ============================================================================

-- 1) S'assurer que la date d'inscription existe sur les agents
alter table agents add column if not exists created_at timestamptz default now();

-- ============================================================================
-- 2) ABONNEMENTS
-- ============================================================================
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  plan text not null check (plan in ('agent', 'manager')),
  monthly_amount int not null,
  status text not null default 'trial' check (status in ('trial', 'active', 'expired', 'pending_payment')),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create unique index if not exists subscriptions_agent_id_key on subscriptions(agent_id);

alter table subscriptions enable row level security;

create policy "agent lit son propre abonnement"
  on subscriptions for select
  using (auth.uid() = agent_id);

create policy "agent cree son propre abonnement"
  on subscriptions for insert
  with check (auth.uid() = agent_id);

create policy "owner lit tous les abonnements"
  on subscriptions for select
  using (exists (select 1 from agents a where a.id = auth.uid() and a.is_platform_owner = true));

create policy "owner met a jour les abonnements"
  on subscriptions for update
  using (exists (select 1 from agents a where a.id = auth.uid() and a.is_platform_owner = true));

-- ============================================================================
-- 3) DÉCLARATIONS DE PAIEMENT (abonnement mensuel ou déblocage historique)
-- ============================================================================
create table if not exists subscription_payments (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  type text not null check (type in ('abonnement', 'historique')),
  amount int not null,
  period_month date not null,        -- 1er jour du mois concerné, ex: 2026-08-01
  payment_reference text,            -- référence donnée par l'agent (transaction mobile money)
  status text not null default 'pending' check (status in ('pending', 'validated', 'rejected')),
  rejected_reason text,
  created_at timestamptz default now(),
  validated_at timestamptz
);

alter table subscription_payments enable row level security;

create policy "agent lit ses paiements"
  on subscription_payments for select
  using (auth.uid() = agent_id);

create policy "agent declare un paiement"
  on subscription_payments for insert
  with check (auth.uid() = agent_id);

create policy "owner lit tous les paiements"
  on subscription_payments for select
  using (exists (select 1 from agents a where a.id = auth.uid() and a.is_platform_owner = true));

create policy "owner valide les paiements"
  on subscription_payments for update
  using (exists (select 1 from agents a where a.id = auth.uid() and a.is_platform_owner = true));

-- ============================================================================
-- 4) COMMISSIONS DE PARRAINAGE (500F, une seule génération)
-- ============================================================================
create table if not exists referral_commissions (
  id uuid primary key default gen_random_uuid(),
  referrer_agent_id uuid not null references agents(id) on delete cascade,
  referred_agent_id uuid not null references agents(id) on delete cascade,
  amount int not null default 300,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  created_at timestamptz default now(),
  paid_at timestamptz
);
-- Un filleul ne peut générer qu'UNE seule commission (une seule génération, pas de cascade)
create unique index if not exists referral_commissions_referred_agent_id_key on referral_commissions(referred_agent_id);

alter table referral_commissions enable row level security;

create policy "parrain lit ses commissions"
  on referral_commissions for select
  using (auth.uid() = referrer_agent_id);

create policy "owner lit toutes les commissions"
  on referral_commissions for select
  using (exists (select 1 from agents a where a.id = auth.uid() and a.is_platform_owner = true));

create policy "owner met a jour les commissions"
  on referral_commissions for update
  using (exists (select 1 from agents a where a.id = auth.uid() and a.is_platform_owner = true));

-- Déclenchement automatique : quand le PREMIER paiement d'abonnement d'un agent
-- est validé, on crée la commission de 500F pour son parrain (une seule fois,
-- grâce à l'index unique ci-dessus).
create or replace function handle_first_subscription_validated()
returns trigger as $$
declare
  v_referred_by_phone text;
  v_referrer_id uuid;
begin
  if new.status = 'validated' and new.type = 'abonnement'
     and (old.status is distinct from 'validated') then

    -- Est-ce le premier paiement d'abonnement validé de cet agent ?
    if not exists (
      select 1 from subscription_payments
      where agent_id = new.agent_id and type = 'abonnement' and status = 'validated' and id <> new.id
    ) then
      select referred_by_phone into v_referred_by_phone from agents where id = new.agent_id;

      if v_referred_by_phone is not null then
        select id into v_referrer_id from agents where phone = v_referred_by_phone limit 1;

        if v_referrer_id is not null then
          insert into referral_commissions (referrer_agent_id, referred_agent_id, amount, status)
          values (v_referrer_id, new.agent_id, 300, 'pending')
          on conflict (referred_agent_id) do nothing;
        end if;
      end if;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_first_subscription_validated on subscription_payments;
create trigger trg_first_subscription_validated
  after update on subscription_payments
  for each row execute function handle_first_subscription_validated();

-- ============================================================================
-- 5) CHAT ENTRE AGENTS
-- ============================================================================
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  agent_name text not null,
  agent_role text not null,
  content text not null,
  created_at timestamptz default now()
);

alter table chat_messages enable row level security;

create policy "tout agent connecte lit le chat"
  on chat_messages for select
  using (auth.uid() is not null);

create policy "tout agent connecte ecrit dans le chat"
  on chat_messages for insert
  with check (auth.uid() = agent_id);

-- Active le temps réel sur la table du chat (si pas déjà fait globalement)
alter publication supabase_realtime add table chat_messages;

-- ============================================================================
-- Fin de la migration
-- ============================================================================
