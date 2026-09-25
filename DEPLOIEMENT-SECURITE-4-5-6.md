# Correctifs sécurité restants (failles #4, #5, #6)

## Faille #4 — PIN démo "1234" codé en dur
Déjà corrigée précédemment (Edge Function verify-pin) : aucune valeur
fixe n'est plus acceptée. Rien à faire.

## Faille #5 — Transactions hors-ligne en clair dans localStorage
Corrigée dans App.jsx : la file d'attente hors-ligne est maintenant
chiffrée (AES-GCM, clé non-extractible générée par le navigateur et
stockée dans IndexedDB) avant d'être écrite dans localStorage.
- Rien à faire côté Supabase.
- Redéployer simplement le nouveau App.jsx (Vercel redéploiera
  automatiquement si le repo GitHub est mis à jour).
- Les anciennes files déjà en clair sur les téléphones des agents sont
  lues normalement une dernière fois puis rechiffrées automatiquement.

## Faille #6 — CORS "*" (wildcard) sur les Edge Functions
Corrigée dans les 3 fonctions : verify-pin, set-pin, login-by-phone.
Elles n'acceptent plus que les origines suivantes :
- https://empireguichet.vercel.app
- http://localhost:5173 et http://localhost:3000 (dev local)

### À faire dans Supabase (dashboard → Edge Functions) :
Pour CHACUNE des 3 fonctions (verify-pin, set-pin, login-by-phone) :
1. Ouvrir la fonction → onglet "Code"
2. Remplacer tout le contenu par le fichier correspondant fourni ici
   (supabase/functions/<nom>/index.ts)
3. Déployer

⚠️ Si tu utilises un domaine personnalisé en plus de
empireguichet.vercel.app, ajoute-le dans la liste ALLOWED_ORIGINS en
haut de chacun des 3 fichiers avant de déployer, sinon les agents sur
ce domaine ne pourront plus se connecter.
