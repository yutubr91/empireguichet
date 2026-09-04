# EmpireGuichet 

Application de gestion de guichet mobile money pour agents et chefs d'agence en Afrique de l'Ouest.

## 🚀 Fonctionnalités

- ✅ Gestion multi-réseaux (MTN, Orange, Moov, Wave, Djamo)
- ✅ Transactions crypto (USDT BEP20)
- ✅ Paiement de factures (CIE, SODECI, Péage)
- ✅ Système d'agences avec codes d'invitation
- ✅ Vérification KYC sécurisée
- ✅ Chat entre agents (public + messages privés)
- ✅ Système de parrainage (300 FCFA par filleul)
- ✅ Publicités et annonces
- ✅ Mode hors-ligne avec synchronisation
- ✅ PWA installable sur mobile

## 🛠️ Stack Technique

- **Frontend** : React 18 + Vite
- **Backend** : Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Styling** : Tailwind CSS
- **Déploiement** : Vercel

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/TON_USERNAME/empireguichet.git
cd empireguichet

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Lancer en développement
npm run dev