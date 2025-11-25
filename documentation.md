# Documentation du Projet LivresGourmands.net



### Authentification
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/me` - Profil utilisateur connecté
- `PUT /api/auth/me` - Mise à jour profil
- `PUT /api/auth/me/password` - Changement mot de passe

### Ouvrages
- `GET /api/ouvrages` - Liste des ouvrages (avec filtres)
- `GET /api/ouvrages/:id` - Détail d'un ouvrage
- `POST /api/ouvrages` - Créer ouvrage (gestionnaire/éditeur)
- `PUT /api/ouvrages/:id` - Modifier ouvrage (gestionnaire/éditeur)
- `DELETE /api/ouvrages/:id` - Supprimer ouvrage (gestionnaire/éditeur)

### Catégories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/:id` - Détail d'une catégorie
- `POST /api/categories` - Créer catégorie (éditeur/gestionnaire)
- `PUT /api/categories/:id` - Modifier catégorie (éditeur/gestionnaire)
- `DELETE /api/categories/:id` - Supprimer catégorie (éditeur/gestionnaire)

### Panier
- `GET /api/panier` - Récupérer le panier
- `POST /api/panier/items` - Ajouter article au panier
- `PUT /api/panier/items/:id` - Modifier quantité
- `DELETE /api/panier/items/:id` - Supprimer article
- `DELETE /api/panier` - Vider le panier

## Règles Métier Implémentées

### Gestion du Stock
- Seuls les ouvrages avec stock > 0 sont visibles publiquement
- Lors de la validation d'une commande, le stock est décrémenté automatiquement
- Vérification du stock avant ajout au panier

### Authentification et Autorisation
- Hashage des mots de passe avec bcrypt (12 rounds)
- Tokens JWT pour l'authentification
- Système de rôles (client, éditeur, gestionnaire, administrateur)
- Protection des routes sensibles par middleware

### Validation des Données
- Validation côté serveur avec express-validator
- Validation des formats email, ISBN, prix
- Contraintes de longueur et de type
- Messages d'erreur personnalisés

### Sécurité
- Protection CORS configurée
- Rate limiting pour éviter les abus
- Headers de sécurité avec Helmet
- Validation des entrées utilisateur
- Pas de stockage de données bancaires

## Limitations Connues

1. **Paiements** : Intégration Stripe/PayPal non implémentée (simulation uniquement)
2. **Emails** : Système d'envoi d'emails non configuré
3. **Upload d'images** : Gestion des fichiers non implémentée
4. **Recherche avancée** : Moteur de recherche basique
5. **Cache** : Pas de système de cache implémenté
6. **Tests** : Couverture de tests limitée

## Améliorations Possibles

1. **Performance**
   - Mise en place d'un cache Redis
   - Optimisation des requêtes SQL
   - Pagination côté serveur

2. **Fonctionnalités**
   - Système de recommandations
   - Notifications push
   - Chat en ligne
   - Programme de fidélité

3. **Sécurité**
   - Authentification 2FA
   - Audit logs
   - Chiffrement des données sensibles

4. **Monitoring**
   - Logs centralisés
   - Métriques de performance
   - Alertes automatiques

## Instructions d'Installation

### Prérequis
- Node.js (v16+)
- MySQL (v8+)
- Git

### Backend
```bash
cd backend
npm install
cp env.example .env
# Configurer les variables d'environnement
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Base de données
```bash
mysql -u root -p
source database/schema.sql
source database/test_data.sql
```

## Auteurs
- **Marie Dubois** - Développement Backend
- **Pierre Martin** - Développement Frontend

## Date
Décembre 2024
