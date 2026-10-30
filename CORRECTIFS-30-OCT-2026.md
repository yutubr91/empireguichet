# Correctifs du 30 octobre 2026

## 1. CORS des Edge Functions (paiement USDT « Service indisponible »)
Fichiers : `supabase/functions/{usdt-payment,login-by-phone,set-pin,verify-pin}/index.ts`
- Origine `https://empireguichet-w7xs.vercel.app` ajoutée à `ALLOWED_ORIGINS`.
- En-tête `x-supabase-api-version` autorisé, `Access-Control-Allow-Methods: POST, OPTIONS` ajouté.
- À redéployer : `supabase functions deploy <nom>` pour chacune des 4 fonctions.
- À terme : rattacher un domaine fixe à Vercel et n'autoriser que celui-ci.

## 2. File hors-ligne (App.jsx, `flushOfflineQueue`)
Une transaction n'est envoyée que par le compte qui l'a créée (évite les 403 RLS en boucle quand
deux comptes se partagent un navigateur). La transaction reste conservée jusqu'à la reconnexion de son propriétaire.

## 3. Annonces expirées (`ads`)
Fichier : `supabase_migration_ads_delete_fix.sql` — à exécuter une fois dans le SQL Editor.
Retire la suppression anonyme, autorise les connectés pour les annonces expirées, accorde le GRANT DELETE manquant.

## 4. Secret à définir (Supabase → Edge Functions → Secrets)
`USDT_RECEIVE_ADDRESS` = adresse BNB Chain (BEP20) de réception.

## 5. Droits du rôle serveur (paiement USDT : « permission denied for table subscription_payments »)
Fichier : `supabase_migration_grants_service_role.sql` — à exécuter une fois dans le SQL Editor.

## Ordre de mise en ligne
1. SQL Editor : exécuter `supabase_migration_usdt_auto.sql` (déjà fait si les 5 colonnes existent),
   puis `supabase_migration_grants_service_role.sql` et `supabase_migration_ads_delete_fix.sql`.
2. Edge Functions : déployer les 4 fonctions (usdt-payment, login-by-phone, set-pin, verify-pin).
3. Secrets : `USDT_RECEIVE_ADDRESS`.
4. GitHub -> Vercel : pousser le code (App.jsx).
5. Test avec un compte agent non propriétaire : Abonnement -> Payer en USDT.
