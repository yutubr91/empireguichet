# Sécurisation KYC / rôles — guide de déploiement

## Le risque trouvé

`approveKycAgent()` et `rejectKycAgent()` faisaient un `.update({ kyc_status: ... })`
**directement depuis le navigateur** sur la table `agents`, en s'appuyant
uniquement sur la RLS pour empêcher qu'un agent valide son propre dossier —
ou pire, modifie directement `role` / `is_platform_owner` / `agency_id` sur
sa propre ligne pour s'auto-promouvoir chef d'agence ou propriétaire.
Contrairement au reste du code (transfert d'agence, résolution de doublon
d'identité), cette action ne passait par aucune fonction serveur dédiée.

## Avant d'exécuter la migration

Je n'ai pas accès à ta base Supabase, donc je n'ai pas pu voir la RLS
actuelle de `agents` (la table n'est pas dans ce zip — elle a été créée
avant ces migrations). Vérifie d'abord ce qui existe déjà, dans l'éditeur
SQL Supabase :

```sql
select polname, polcmd, pg_get_expr(polqual, polrelid) as using_expr,
       pg_get_expr(polwithcheck, polrelid) as with_check_expr
from pg_policy
where polrelid = 'public.agents'::regclass;
```

Si tu vois une policy `UPDATE` du style `using (auth.uid() = id)` **sans
restriction de colonnes**, c'est bien la faille décrite ci-dessus.

## Étapes

1. **Exécuter** `supabase_migration_securite_kyc_et_roles.sql` dans
   l'éditeur SQL Supabase. Elle crée `validate_kyc()` et `reject_kyc()`
   (avec les bonnes vérifications : pas de self-service, un chef ne valide
   que les agents de sa propre agence, un chef d'agence n'est validé que
   par le propriétaire).
2. **Lire le commentaire avant la dernière instruction** (`revoke update
   (...) on public.agents from authenticated`) : comme pour `pin_hash`,
   vérifie qu'aucun autre écran ne fait encore un `.update()` direct sur
   `role`, `is_platform_owner`, `agency_id`, `agency_name`, `kyc_status`,
   `kyc_rejected_reason` ou `identity_override` avant de l'exécuter.
3. **Redéployer** le `App.jsx` fourni : `approveKycAgent()` et
   `rejectKycAgent()` appellent maintenant `supabase.rpc("validate_kyc", …)`
   et `supabase.rpc("reject_kyc", …)` au lieu d'écrire directement dans
   `agents`.
4. **Tester** : validation et refus d'un dossier agent par son chef,
   validation/refus d'un dossier chef d'agence par le propriétaire, et
   vérifier qu'un agent qui essaie d'appeler `validate_kyc` sur son propre
   `id` (ou sur un agent d'une autre agence) reçoit bien une erreur.

## Pourquoi les fonctions existantes (transfert, doublon) continuent de marcher

`apply_agency_transfer()` et `resolve_identity_duplicate()` font déjà des
`update agents ...` en direct dans leur code. Comme ce sont des fonctions
`SECURITY DEFINER`, elles s'exécutent avec les droits du propriétaire de la
fonction (pas ceux du rôle `authenticated`) — le `revoke` de cette
migration ne les affecte donc pas.
