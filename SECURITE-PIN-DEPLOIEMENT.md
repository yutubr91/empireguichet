# Sécurisation du PIN — guide de déploiement

## Ce qui a changé

Avant : le PIN était haché avec `bcryptjs` **dans le navigateur**, et le hash
était ensuite lu/écrit directement par le client sur la table `agents`.
Problème réel : plusieurs écrans faisaient `select("*")` sur `agents` et
chargeaient donc le hash bcrypt du PIN dans le navigateur — y compris,
pour un chef d'agence ou le propriétaire, **le hash PIN de tous les autres
agents** consultés dans les listes de vérification KYC. Un PIN à 4 chiffres
ne compte que 10 000 combinaisons : un hash bcrypt exposé se casse hors
ligne en quelques secondes, malgré le hachage.

Maintenant :
- Le hachage et la comparaison bcrypt se font **uniquement** dans deux Edge
  Functions Supabase (`verify-pin`, `set-pin`), avec la clé `service_role`
  (jamais exposée au client).
- Le client n'appelle plus jamais `pin_hash` directement : il envoie le PIN
  en clair via HTTPS à la fonction, et ne reçoit qu'un booléen en retour.
- Toutes les requêtes `select("*")` sur `agents` ont été remplacées par des
  listes de colonnes explicites qui excluent `pin_hash`.
- Une fonction SQL `get_pin_status()` renvoie juste deux booléens (PIN
  valide ? PIN legacy en clair à migrer ?) sans jamais exposer le hash.

## Étapes de déploiement

1. **Déployer les Edge Functions** (nécessite la Supabase CLI) :
   ```bash
   supabase functions deploy verify-pin
   supabase functions deploy set-pin
   ```
   Aucune variable d'environnement à configurer manuellement : `SUPABASE_URL`
   et `SUPABASE_SERVICE_ROLE_KEY` sont injectées automatiquement par
   Supabase dans l'environnement d'exécution des Edge Functions.

2. **Exécuter la migration SQL** `supabase_migration_securite_pin_edge_functions.sql`
   dans l'éditeur SQL de Supabase (ou via `supabase db push`).
   ⚠️ Lis bien le commentaire dans le fichier avant d'exécuter la dernière
   ligne (`revoke select/update ... from authenticated`) : elle bloque tout
   accès direct de l'app à `pin_hash`, donc si tu as d'autres écrans
   personnalisés (en dehors de ce `App.jsx`) qui font `select("*")` sur
   `agents`, corrige-les d'abord avec une liste de colonnes explicite.

3. **Redéployer le front** avec le `App.jsx` et le `package.json` fournis
   (dépendance `bcryptjs` retirée côté client).

4. **Tester** : inscription (création de PIN), connexion + confirmation
   d'une transaction (vérification), changement de PIN dans Paramètres,
   et le cas de réinitialisation forcée si un compte a encore un ancien
   PIN en clair.

## Ce qui n'a pas besoin de migration de données

Les hash bcrypt déjà stockés en base restent valides tels quels : les
Edge Functions les lisent et les comparent exactement comme le faisait le
code client avant. Aucun agent n'a besoin de recréer son PIN suite à ce
changement (sauf ceux qui étaient déjà en attente de migration à cause
d'un ancien PIN stocké en clair — flux inchangé).
