-- Script pour vérifier que la base de données est créée
-- Exécutez ce script avec : mysql -u root -p < check_database.sql

-- Afficher toutes les bases de données
SHOW DATABASES;

-- Utiliser la base de données livresgourmands
USE livresgourmands;

-- Afficher toutes les tables
SHOW TABLES;

-- Compter le nombre de tables
SELECT COUNT(*) as nombre_tables FROM information_schema.tables 
WHERE table_schema = 'livresgourmands';

-- Vérifier les utilisateurs
SELECT COUNT(*) as nombre_utilisateurs FROM users;

-- Vérifier les ouvrages
SELECT COUNT(*) as nombre_ouvrages FROM ouvrages;

-- Vérifier les catégories
SELECT COUNT(*) as nombre_categories FROM categories;

-- Afficher quelques exemples d'ouvrages
SELECT id, titre, auteur, prix, stock FROM ouvrages LIMIT 5;

-- Afficher les catégories
SELECT id, nom, description FROM categories;

