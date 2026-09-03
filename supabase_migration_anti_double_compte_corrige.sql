-- ============================================================================
-- EmpireGuichet — Empêcher qu'une même personne ait 2 comptes vérifiés (KYC)
-- Version corrigée : les colonnes sont ajoutées AVANT les fonctions qui les
-- utilisent (l'ordre du fichier d'origine causait une erreur "column does
-- not exist" à la création de check_duplicate_identity).
-- ============================================================================

-- 1) D'abord les colonnes de suivi des doublons
alter table agents add column if not exists identity_duplicate_match_type text;
alter table agents add column if not exists identity_duplicate_agent_id uuid;
alter table agents add column if not exists identity_override boolean default false;

-- 2) Ensuite les fonctions qui les utilisent
create or replace function check_duplicate_identity(
  p_id_number text,
  p_first_name text,
  p_last_name text,
  p_address text
)
returns table(match_type text, matched_agent_id uuid)
language sql
security definer
as $$
  select
    case
      when p_id_number is not null and trim(p_id_number) <> ''
        and lower(trim(a.id_number)) = lower(trim(p_id_number))
      then 'id_number'
      else 'nom_adresse'
    end as match_type,
    a.id as matched_agent_id
  from agents a
  where a.kyc_status = 'validated'
    and a.id <> auth.uid()
    and not exists (select 1 from agents me where me.id = auth.uid() and me.identity_override = true)
    and (
      (
        p_id_number is not null and trim(p_id_number) <> ''
        and lower(trim(a.id_number)) = lower(trim(p_id_number))
      )
      or (
        p_first_name is not null and trim(p_first_name) <> ''
        and p_last_name is not null and trim(p_last_name) <> ''
        and p_address is not null and trim(p_address) <> ''
        and lower(trim(a.first_name)) = lower(trim(p_first_name))
        and lower(trim(a.last_name)) = lower(trim(p_last_name))
        and lower(trim(a.address)) = lower(trim(p_address))
      )
    )
  limit 1;
$$;

grant execute on function check_duplicate_identity(text, text, text, text) to authenticated;

create unique index if not exists idx_agents_unique_validated_id_number
  on agents (lower(trim(id_number)))
  where kyc_status = 'validated' and id_number is not null and trim(id_number) <> '';

create or replace function get_identity_duplicates()
returns table(
  agent_id uuid,
  agent_full_name text,
  agent_phone text,
  match_type text,
  matched_agent_id uuid,
  matched_full_name text
)
language sql
security definer
as $$
  select
    a.id, a.full_name, a.phone,
    a.identity_duplicate_match_type,
    m.id, m.full_name
  from agents a
  left join agents m on m.id = a.identity_duplicate_agent_id
  where a.identity_duplicate_match_type is not null
    and a.identity_override = false
    and exists (select 1 from agents me where me.id = auth.uid() and me.is_platform_owner = true);
$$;

grant execute on function get_identity_duplicates() to authenticated;

create or replace function resolve_identity_duplicate(p_agent_id uuid, p_action text)
returns void
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from agents where id = auth.uid() and is_platform_owner = true) then
    raise exception 'Action réservée au propriétaire de la plateforme';
  end if;

  if p_action = 'override' then
    update agents
      set identity_override = true,
          identity_duplicate_match_type = null,
          identity_duplicate_agent_id = null
      where id = p_agent_id;
  elsif p_action = 'reject' then
    update agents
      set kyc_status = 'rejected',
          kyc_rejected_reason = 'Doublon d''identité confirmé (même personne déjà inscrite)',
          identity_duplicate_match_type = null,
          identity_duplicate_agent_id = null
      where id = p_agent_id;
  else
    raise exception 'Action inconnue : %', p_action;
  end if;
end;
$$;

grant execute on function resolve_identity_duplicate(uuid, text) to authenticated;
