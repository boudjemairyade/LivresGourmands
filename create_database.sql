-- Script pour créer uniquement la base de données
-- À exécuter dans MySQL Workbench ou via la ligne de commande

CREATE DATABASE IF NOT EXISTS livresgourmands 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE livresgourmands;

-- Afficher un message de confirmation
SELECT 'Base de données livresgourmands créée avec succès !' AS Message;


