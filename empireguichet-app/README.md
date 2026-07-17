# EmpireGuichet — projet prêt à déployer

## Déployer sur Vercel (recommandé, ~10 min)

### Étape 1 — Mettre le code sur GitHub
1. Va sur https://github.com et crée un compte si tu n'en as pas.
2. Clique sur "New repository", nomme-le `empireguichet`, laisse-le "Public" ou "Private", ne coche AUCUNE case (pas de README/gitignore), clique "Create repository".
3. Sur la page qui s'affiche, clique sur le lien "uploading an existing file".
4. Glisse-dépose TOUS les fichiers et dossiers de ce projet (garde la même structure : src/ doit rester un dossier).
5. Clique "Commit changes".

### Étape 2 — Connecter à Vercel
1. Va sur https://vercel.com et clique "Sign Up" → choisis "Continue with GitHub".
2. Une fois connecté, clique "Add New..." → "Project".
3. Trouve ton dépôt `empireguichet` dans la liste et clique "Import".
4. Vercel détecte automatiquement "Vite" comme framework — ne change rien.
5. Clique "Deploy".
6. Patiente 1-2 minutes. Une fois terminé, Vercel te donne un lien du type `empireguichet.vercel.app`.

### Si le déploiement échoue
Ouvre l'onglet "Deployments" sur Vercel, clique sur le déploiement en rouge, et regarde les "Build Logs" — copie-moi le message d'erreur exact, je pourrai le corriger directement.

## Lancer en local pour tester avant de déployer (optionnel)
```
npm install
npm run dev
```
