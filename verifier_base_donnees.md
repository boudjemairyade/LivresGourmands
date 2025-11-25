# Guide pour vérifier la base de données MySQL

## Méthode 1 : Via MySQL Command Line (si MySQL est dans le PATH)

1. Ouvrez un terminal/Invite de commandes
2. Connectez-vous à MySQL :
   ```bash
   mysql -u root -p
   ```
3. Entrez votre mot de passe MySQL
4. Exécutez les commandes suivantes :

```sql
-- Voir toutes les bases de données
SHOW DATABASES;

-- Utiliser la base de données livresgourmands
USE livresgourmands;

-- Voir toutes les tables
SHOW TABLES;

-- Vérifier le nombre d'utilisateurs
SELECT COUNT(*) FROM users;

-- Vérifier le nombre d'ouvrages
SELECT COUNT(*) FROM ouvrages;

-- Voir quelques ouvrages
SELECT id, titre, auteur, prix FROM ouvrages LIMIT 5;
```

## Méthode 2 : Via MySQL Workbench (Interface graphique)

1. Ouvrez MySQL Workbench
2. Connectez-vous à votre serveur MySQL
3. Dans le panier de gauche, cherchez la base de données `livresgourmands`
4. Si elle existe, cliquez dessus pour voir les tables
5. Double-cliquez sur une table pour voir son contenu

## Méthode 3 : Via le script SQL fourni

1. Ouvrez un terminal dans le dossier `database`
2. Exécutez :
   ```bash
   mysql -u root -p < check_database.sql
   ```
3. Entrez votre mot de passe MySQL

## Méthode 4 : Via phpMyAdmin (si installé)

1. Ouvrez phpMyAdmin dans votre navigateur (généralement `http://localhost/phpmyadmin`)
2. Dans le panier de gauche, cherchez `livresgourmands`
3. Cliquez dessus pour voir toutes les tables

## Vérifications à faire

 La base de données `livresgourmands` existe
 Les tables suivantes existent :
   - users
   - categories
   - ouvrages
   - panier
   - panier_items
   - commandes
   - commande_items
   - avis
   - commentaires
   - listes_cadeaux
   - liste_items
   - payments

  Il y a des données dans les tables :
   - Au moins 6 catégories
   - Au moins 6 ouvrages
   - Au moins 4 utilisateurs (clients de test)

## Si la base de données n'existe pas

Exécutez les scripts SQL dans l'ordre :

```bash
# 1. Créer la base et les tables
mysql -u root -p < database/schema.sql

# 2. Ajouter les données de test
mysql -u root -p < database/test_data.sql
```

## Vérification rapide via Node.js

Vous pouvez aussi créer un petit script Node.js pour vérifier :

```javascript
// check-db.js
const mysql = require('mysql2/promise');

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'votre_mot_de_passe',
    database: 'livresgourmands'
  });

  const [tables] = await connection.execute('SHOW TABLES');
  console.log('Tables trouvées:', tables.length);
  
  const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
  console.log('Utilisateurs:', users[0].count);
  
  const [ouvrages] = await connection.execute('SELECT COUNT(*) as count FROM ouvrages');
  console.log('Ouvrages:', ouvrages[0].count);

  await connection.end();
}

checkDatabase().catch(console.error);
```

