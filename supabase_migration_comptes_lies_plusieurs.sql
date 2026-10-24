-- ============================================================================
-- EmpireGuichet — Plusieurs comptes par réseau pour un chef d'agence
-- (ex. 4 numéros MTN, 3 Orange, 5 Moov)
-- À exécuter dans Supabase → SQL Editor, APRÈS supabase_migration_comptes_lies_chef.sql
--
-- AVANT de lancer ce script, exécute la requête de vérification donnée dans le chat
-- (nom de la contrainte + nombre de lignes déjà présentes).
--
-- Ce que fait ce script :
--  1. ajoute une colonne « label » (nom du compte, facultatif) ;
--  2. retire la règle « un seul compte par agence et par réseau » ;
--  3. la remplace par « un même numéro ne peut pas être relié deux fois ».
-- Aucune ligne n'est supprimée.
-- ============================================================================

alter table agency_linked_accounts
  add column if not exists label text check (label is null or char_length(label) <= 40);

alter table agency_linked_accounts
  drop constraint if exists agency_linked_accounts_agency_id_network_key;

create unique index if not exists agency_linked_accounts_unique_number
  on agency_linked_accounts (agency_id, network, identifier);
