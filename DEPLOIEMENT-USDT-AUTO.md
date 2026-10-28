# Paiement USDT automatique (BEP20) — guide de déploiement

Ordre à respecter. **Ne publie pas le nouveau code de l'application avant l'étape 3.**

## 1. Vérifications avant le script SQL — faites
Les règles de sécurité de la base ont été relevées (la règle de création d'abonnement était déjà correcte ; la règle
des paiements imposait déjà « pending » et les montants 2500 / 200, que le script conserve) et la définition de
`auth.uid()` a été confirmée.

## 2. Script SQL
Exécute `supabase_migration_usdt_auto.sql` (relançable sans risque, ne supprime aucune donnée).
Résultat attendu : « Success. No rows returned ».

## 3. Fonction serveur
Supabase → Edge Functions → « Deploy a new function » → nom exact : `usdt-payment`.
Colle le contenu de `supabase/functions/usdt-payment/index.ts`.

Supabase → Edge Functions → Secrets, ajoute :
- `USDT_RECEIVE_ADDRESS` = ton adresse de réception (0x…, réseau BNB Chain / BEP20)

Facultatifs : `XOF_PER_USDT` (défaut 600), `PRICE_AGENT_FCFA`, `PRICE_MANAGER_FCFA`, `PRICE_HISTORIQUE_FCFA`
(défauts 2500 / 2500 / 200), `USDT_RECEIVE_ADDRESS_PREVIOUS` (anciennes adresses, séparées par des virgules),
`BSC_RPC_URLS` (nœuds BNB Chain personnalisés).

## 4. Publier l'application (GitHub → Vercel)

## 5. Test réel
Avec un compte qui n'est PAS propriétaire : Abonnement → « Payer en USDT » → envoie le montant exact → colle le hash → « Vérifier ».

## Changer l'adresse de réception
Modifie le secret `USDT_RECEIVE_ADDRESS`. Si des paiements sont encore en cours, mets l'ancienne adresse dans
`USDT_RECEIVE_ADDRESS_PREVIOUS` pour qu'ils restent vérifiables.

## Tests automatiques
`tests/usdt-payment.test.ts` (Deno) : 18 tests sur la vérification de la blockchain, les montants, le rejeu de hash,
les fausses demandes et l'activation.
