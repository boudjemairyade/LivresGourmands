# Instructions d'Installation - LivresGourmands.net

## Prérequis Système

### Applications Requises
- **Node.js** (version 16 ou supérieure)
- **MySQL** (version 8 ou supérieure)
- **Git** (pour le contrôle de version)
- **Un éditeur de code** (VS Code recommandé)

### Installation des Prérequis

#### Windows
1. **Node.js** : Télécharger depuis https://nodejs.org/
2. **MySQL** : Télécharger MySQL Community Server depuis https://dev.mysql.com/downloads/mysql/
3. **Git** : Télécharger depuis https://git-scm.com/download/win

#### macOS
```bash
# Avec Homebrew
brew install node mysql git

# Ou télécharger depuis les sites officiels
```

#### Linux (Ubuntu/Debian)
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MySQL
sudo apt update
sudo apt install mysql-server

# Git
sudo apt install git
```

## Installation du Projet

### 1. Cloner le Projet
```bash
git clone <url-du-depot>
cd livresgourmands
```

### 2. Configuration de la Base de Données

#### Créer la Base de Données
```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE livresgourmands CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
```

#### Importer le Schéma
```bash
# Importer le schéma
mysql -u root -p livresgourmands < database/schema.sql

# Importer les données de test
mysql -u root -p livresgourmands < database/test_data.sql
```

### 3. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier de configuration
cp env.example .env

# Éditer le fichier .env avec vos paramètres
```

#### Configuration du fichier .env
```env
# Configuration du serveur
NODE_ENV=development
PORT=3000

# Configuration de la base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=livresgourmands
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql

# Configuration JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_securise_ici_changez_le
JWT_EXPIRES_IN=24h

# Configuration CORS
CORS_ORIGIN=http://localhost:3001
```

### 4. Configuration du Frontend

```bash
cd frontend

# Installer les dépendances
npm install
```

### 5. Démarrage des Services

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## Vérification de l'Installation

### 1. Test de l'API
Ouvrir http://localhost:3000 dans votre navigateur
- Vous devriez voir la réponse JSON de l'API

### 2. Test de Santé
Ouvrir http://localhost:3000/api/health
- Vérifier que la base de données est connectée

### 3. Test du Frontend
Ouvrir http://localhost:3001 dans votre navigateur
- Vous devriez voir la page d'accueil de LivresGourmands

## Comptes de Test

### Administrateur
- **Email** : admin@livresgourmands.net
- **Mot de passe** : admin123

### Éditeur
- **Email** : editeur@livresgourmands.net
- **Mot de passe** : editeur123

### Gestionnaire
- **Email** : gestionnaire@livresgourmands.net
- **Mot de passe** : gestionnaire123

### Client Test
- **Email** : jean.dupont@email.com
- **Mot de passe** : client123

 


## Commandes Utiles

### Backend
```bash
npm run dev          # Démarrage en mode développement
npm start            # Démarrage en mode production
npm test             # Exécution des tests
npm run lint         # Vérification du code
```

### Frontend
```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build pour production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification du code
```

### Base de Données
```bash
# Connexion MySQL
mysql -u root -p livresgourmands

# Sauvegarde
mysqldump -u root -p livresgourmands > backup.sql

# Restauration
mysql -u root -p livresgourmands < backup.sql
```

## Résolution de Problèmes

### Erreur de Connexion Base de Données
1. Vérifier que MySQL est démarré
2. Vérifier les paramètres dans .env
3. Vérifier que la base de données existe

### Erreur de Port Déjà Utilisé
1. Changer le port dans .env (backend)
2. Redémarrer le serveur

### Erreur de Dépendances
1. Supprimer node_modules et package-lock.json
2. Réinstaller avec `npm install`

### Erreur CORS
1. Vérifier CORS_ORIGIN dans .env
2. S'assurer que le frontend tourne sur le bon port

## Support

Pour toute question ou problème :
1. Consulter la documentation dans `/docs`
2. Vérifier les logs dans la console
3. Contacter l'équipe de développement


