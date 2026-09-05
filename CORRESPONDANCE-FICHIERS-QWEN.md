# Correspondance fichiers Qwen → fichiers finaux du projet

Qwen a reproduit presque exactement ce qu'on a construit aujourd'hui, avec
quelques bugs. Voici où retrouver la version corrigée de chaque fichier
Qwen dans cette archive.

| Fichier Qwen | Statut | Fichier final à utiliser |
|---|---|---|
| `vite.config.js`, `postcss.config.js`, `tailwind.config.js`, `main.jsx`, `supabaseClient.js`, `index.html`, `package.json` | ✅ Bons tels quels | Repris à l'identique |
| `App.jsx` (placeholder "colle ici ton fichier") | ❌ Pas un vrai fichier | `App.jsx` (le vrai, ~8000 lignes, déjà sécurisé) |
| `check_recovery_match` | ✅ Bon | `supabase_migration_securite_recuperation_mdp.sql` |
| `get_email_by_phone` | ✅ Bon (déjà en place dans votre base) | Rien à faire, déjà actif |
| `validate_kyc` / `reject_kyc` | ✅ Bon | `supabase_migration_securite_kyc_et_roles.sql` |
| `agency_transfer_requests` + trigger | ✅ Bon, déjà couvert | `supabase_migration_transfert_agence.sql` + `supabase_migration_correctif_valider_transfert.sql` |
| `check_duplicate_identity` (avec la faute `pidades_number`) | 🔴 Corrigé | `supabase_migration_anti_double_compte.sql` |
| `verify-pin` (Edge Function) | ✅ Bon | `supabase/functions/verify-pin/index.ts` |
| `set-pin` (Edge Function, sans `pin_reset_required`) | 🔴 Corrigé | `supabase/functions/set-pin/index.ts` |
| `get_pin_status` v1 (regex non échappée) | 🔴 Corrigé | `supabase_migration_securite_pin_edge_functions.sql` |
| `get_pin_status` v2 avec `pin_reset_required` (regex non échappée + pas de `drop function`) | 🔴 Corrigé | `supabase_migration_forcer_reset_pin_comptes_existants.sql` |
| Chat lu/non lu | ✅ Bon, déjà couvert | `supabase_migration_chat_lu_non_lu.sql` |
| Chat privé chef/agent | ✅ Bon, déjà couvert | `supabase_migration_chat_prive_anonymat.sql` + `supabase_migration_correctif_dm_agent.sql` |

## Les 2 bugs corrigés en détail

**1. Regex bcrypt non échappée** — Qwen a écrit `'^$2[aby]$'` partout. En
PostgreSQL, un `$` qui n'est pas le tout dernier caractère du motif est lu
comme du texte littéral, pas comme une ancre de fin de chaîne. Cette regex
ne reconnaît donc jamais un vrai hash bcrypt (`$2b$10$...`, 60 caractères) —
elle ne matche que la chaîne exacte à 3 caractères `$2a`, `$2b` ou `$2y`.
Corrigé partout en `'^\$2[aby]\$'`.

**2. `set-pin` sans prise en compte de `pin_reset_required`** — Qwen exige
le PIN actuel dès qu'un hash bcrypt existe, sans vérifier si le compte est
en reset forcé. C'est exactement le bug qu'on a mis du temps à trouver
aujourd'hui. Corrigé : `pin_reset_required` est lu depuis la base et
exempte de fournir le PIN actuel.
