-- ============================================================================
-- EmpireGuichet — Système d'abonnements et parrainage
-- ============================================================================

-- 1) TABLE : Abonnements
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  plan text not null check (plan in ('agent', 'manager')),
  monthly_amount int not null default 2500,
  status text not null default 'pending_payment' 
    check (status in ('pending_payment', 'active', 'expired')),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists idx_subscriptions_agent_id on subscriptions(agent_id);

-- 2) TABLE : Paiements d'abonnement
create table if not exists subscription_payments (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  type text not null check (type in ('abonnement', 'historique')),
  amount int not null,
  period_month date not null,
  payment_reference text,
  status text not null default 'pending' check (status in ('pending', 'validated', 'rejected')),
  validated_by uuid references agents(id) on delete set null,
  created_at timestamptz default now(),
  validated_at timestamptz
);

-- 3) TABLE : Commissions de parrainage
create table if not exists referral_commissions (
  id uuid primary key default gen_random_uuid(),
  referrer_agent_id uuid not null references agents(id) on delete cascade,
  referred_agent_id uuid not null references agents(id) on delete cascade,
  amount int not null default 300,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  created_at timestamptz default now(),
  paid_at timestamptz
);

create unique index if not exists referral_commissions_referred_agent_id_key 
on referral_commissions(referred_agent_id);

-- RLS
alter table subscriptions enable row level security;
alter table subscription_payments enable row level security;
alter table referral_commissions enable row level security;

-- Politiques RLS
create policy "agent lit son abonnement" on subscriptions for select
using (auth.uid() = agent_id);

create policy "agent lit ses paiements" on subscription_payments for select
using (auth.uid() = agent_id);

create policy "agent declare paiement" on subscription_payments for insert
with check (auth.uid() = agent_id);

create policy "parrain lit ses commissions" on referral_commissions for select
using (auth.uid() = referrer_agent_id);

-- Trigger pour parrainage automatique
create or replace function handle_first_subscription_validated()
returns trigger
language plpgsql
security definer
as $$
declare
  v_referred_by_phone text;
  v_referrer_id uuid;
  v_referrer_kyc_status text;
begin
  if new.status = 'validated' 
     and new.type = 'abonnement'
     and (old.status is distinct from 'validated') then

    if not exists (
      select 1 from subscription_payments
      where agent_id = new.agent_id 
        and type = 'abonnement' 
        and status = 'validated' 
        and id <> new.id
    ) then

      select trim(referred_by_phone) into v_referred_by_phone 
      from agents where id = new.agent_id;

      if v_referred_by_phone is not null and v_referred_by_phone <> '' then
        select a.id, a.kyc_status 
        into v_referrer_id, v_referrer_kyc_status
        from agents a
        where a.phone = v_referred_by_phone
          and a.kyc_status = 'validated'
          and a.id <> new.agent_id
        limit 1;

        if v_referrer_id is not null then
          insert into referral_commissions 
            (referrer_agent_id, referred_agent_id, amount, status)
          values 
            (v_referrer_id, new.agent_id, 300, 'pending')
          on conflict (referred_agent_id) do nothing;
        end if;
      end if;
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_subscription_payment_validated
after update on subscription_payments
for each row
when (new.status = 'validated' and old.status <> 'validated')
execute function handle_first_subscription_validated();

-- Rattrapage pour comptes existants
insert into subscriptions (agent_id, plan, monthly_amount, status)
select
  a.id,
  case when a.role = 'manager' then 'manager' else 'agent' end,
  2500,
  'pending_payment'
from agents a
where not exists (select 1 from subscriptions s where s.agent_id = a.id);