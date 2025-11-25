# LivresGourmands.net

Site e-commerce spécialisé dans la vente de livres de cuisine. Développé avec React, Node.js, Express et MySQL.

##  Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API](#api)
- [Auteurs](#auteurs)

##  À propos

LivresGourmands.net est une plateforme e-commerce moderne permettant aux amateurs de cuisine de découvrir, consulter et acheter des livres de cuisine. Le projet comprend une interface utilisateur React responsive, une API REST complète avec Node.js/Express, et une base de données MySQL bien structurée.

##  Fonctionnalités

### Frontend (React)
-  **Page d'accueil** avec carrousel interactif des best-sellers
-  **Catalogue de livres** avec filtres avancés (catégorie, prix, tri)
-  **Page détail produit** avec avis clients et gestion du stock
-  **Panier dynamique** avec Context API et localStorage
-  **Authentification** (connexion, inscription, profil)
-  **Design responsive** optimisé mobile, tablette et desktop
- **Accessibilité** avec contrastes et hiérarchie visuelle respectés

### Backend (Node.js/Express)
-  API REST complète
-  Authentification JWT
-  Gestion des ouvrages, catégories, paniers
-  Système d'avis et commentaires
-  Gestion des commandes et paiements
-  Listes de cadeaux partageables

##  Technologies utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **React Router** - Navigation
- **React Query** - Gestion des données serveur
- **Axios** - Client HTTP
- **Bootstrap 5** - Framework CSS
- **React Toastify** - Notifications
- **React Icons** - Icônes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL** - Base de données
- **JWT** - Authentification
- **bcrypt** - Hashage des mots de passe

##  Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone <url-du-depot>
cd "Tp web"
```

2. **Installer les dépendances du backend**
```bash
cd backend
npm install
```

3. **Installer les dépendances du frontend**
```bash
cd ../frontend
npm install
```

4. **Configurer la base de données**
```bash
cd ../database
# Importer le schéma
mysql -u root -p < schema.sql
# Importer les données de test
mysql -u root -p < test_data.sql
```

5. **Configurer les variables d'environnement**

Créez un fichier `.env` dans le dossier `backend/` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=livresgourmands
JWT_SECRET=votre_secret_jwt
PORT=3000
```

##  Configuration

### Backend

1. Copiez `backend/env.example` vers `backend/.env`
2. Modifiez les valeurs selon votre configuration

### Frontend

Le frontend est configuré pour se connecter à l'API sur `http://localhost:3000/api` par défaut. Pour modifier cette URL, éditez `frontend/src/services/api.js`.

##  Utilisation

### Démarrer le backend

```bash
cd backend
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Démarrer le frontend

```bash
cd frontend
npm run dev
```

L'application est accessible sur `http://localhost:5173` (ou le port indiqué par Vite)

### Comptes de test

Après avoir importé les données de test, vous pouvez vous connecter avec :
- **Email** : `jean.dupont@email.com`
- **Mot de passe** : (consultez la documentation pour le mot de passe de test)




##  API

### Endpoints principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

#### Ouvrages
- `GET /api/ouvrages` - Liste des ouvrages (avec filtres)
- `GET /api/ouvrages/:id` - Détails d'un ouvrage
- `GET /api/ouvrages/:id/avis` - Avis d'un ouvrage

#### Panier
- `GET /api/panier` - Récupérer le panier
- `POST /api/panier/items` - Ajouter un article
- `PUT /api/panier/items/:id` - Modifier la quantité
- `DELETE /api/panier/items/:id` - Supprimer un article

#### Catégories
- `GET /api/categories` - Liste des catégories

Pour plus de détails, consultez `docs/documentation.md` et `docs/postman_collection.json`.

##  Conception visuelle

Le projet inclut :
- **Maquettes Figma** - Wireframes desktop et mobile
- **Prototype Adobe XD** - Prototype interactif avec parcours utilisateur
- **Dossier de conception PDF** - Justification des choix UX/UI

##  Critères d'évaluation respectés

-  Maquettes et prototype (Figma/XD)
-  Dossier de conception structuré
-  Intégration front-end React + Bootstrap
-  Panier dynamique avec Context API et localStorage
-  Intégration correcte avec l'API (Axios, endpoints)
-  UX/UI moderne et accessibilité
-  Code clair et organisation du dépôt





