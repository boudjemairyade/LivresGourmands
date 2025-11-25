
-- Base de données : livresgourmands
-- Description : Site e-commerce de livres de cuisine
-- Date : Décembre 2024
-- =============================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS livresgourmands 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE livresgourmands;


-- Table des utilisateurs

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'editeur', 'gestionnaire', 'administrateur') DEFAULT 'client',
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);


-- Table des catégories

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Table des ouvrages (livres)

CREATE TABLE ouvrages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    categorie_id INT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_categorie (categorie_id),
    INDEX idx_stock (stock),
    INDEX idx_prix (prix),
    INDEX idx_titre (titre),
    INDEX idx_auteur (auteur)
);

-- Table des paniers

CREATE TABLE panier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_actif (actif)
);


-- Table des articles du panier

CREATE TABLE panier_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    panier_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    quantite INT NOT NULL CHECK (quantite > 0),
    prix_unitaire DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
    UNIQUE KEY unique_panier_ouvrage (panier_id, ouvrage_id),
    INDEX idx_panier (panier_id),
    INDEX idx_ouvrage (ouvrage_id)
);


-- Table des commandes

CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    statut ENUM('en_cours', 'payee', 'annulee', 'expediee') DEFAULT 'en_cours',
    adresse_livraison TEXT NOT NULL,
    mode_livraison VARCHAR(100) NOT NULL,
    mode_paiement VARCHAR(50) NOT NULL,
    payment_provider_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_client (client_id),
    INDEX idx_statut (statut),
    INDEX idx_date (date_commande)
);


-- Table des articles de commande

CREATE TABLE commande_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    quantite INT NOT NULL CHECK (quantite > 0),
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE RESTRICT,
    INDEX idx_commande (commande_id),
    INDEX idx_ouvrage (ouvrage_id)
);

-- Table des listes de cadeaux

CREATE TABLE listes_cadeaux (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    proprietaire_id INT NOT NULL,
    code_partage VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proprietaire_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_proprietaire (proprietaire_id),
    INDEX idx_code (code_partage)
);


-- Table des articles de liste de cadeaux

CREATE TABLE liste_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    liste_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    quantite_souhaitee INT NOT NULL CHECK (quantite_souhaitee > 0),
    quantite_achetee INT DEFAULT 0 CHECK (quantite_achetee >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (liste_id) REFERENCES listes_cadeaux(id) ON DELETE CASCADE,
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
    UNIQUE KEY unique_liste_ouvrage (liste_id, ouvrage_id),
    INDEX idx_liste (liste_id),
    INDEX idx_ouvrage (ouvrage_id)
);


-- Table des avis

CREATE TABLE avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    note INT NOT NULL CHECK (note >= 1 AND note <= 5),
    commentaire TEXT,
    date_avis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
    UNIQUE KEY unique_client_ouvrage (client_id, ouvrage_id),
    INDEX idx_client (client_id),
    INDEX idx_ouvrage (ouvrage_id),
    INDEX idx_note (note)
);

-- Table des commentaires

CREATE TABLE commentaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    contenu TEXT NOT NULL,
    valide BOOLEAN DEFAULT false,
    date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_validation TIMESTAMP NULL,
    valide_par INT NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
    FOREIGN KEY (valide_par) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_client (client_id),
    INDEX idx_ouvrage (ouvrage_id),
    INDEX idx_valide (valide),
    INDEX idx_date_soumission (date_soumission)
);



CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_payment_id VARCHAR(255) NOT NULL,
    statut VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    INDEX idx_commande (commande_id),
    INDEX idx_provider (provider),
    INDEX idx_statut (statut)
);


-- Données de test


-- Insertion des catégories
INSERT INTO categories (nom, description) VALUES
('Cuisine Française', 'Livres spécialisés dans la cuisine traditionnelle française'),
('Pâtisserie', 'Recettes de desserts, gâteaux et pâtisseries'),
('Cuisine du Monde', 'Recettes de cuisines internationales'),
('Cuisine Végétarienne', 'Recettes sans viande ni poisson'),
('Cuisine Rapide', 'Recettes express pour les repas du quotidien'),
('Cuisine Gastronomique', 'Recettes de haute cuisine et techniques avancées');

-- Insertion d'un administrateur par défaut
INSERT INTO users (nom, email, password_hash, role) VALUES
('Admin LivresGourmands', 'admin@livresgourmands.net', '$2b$10$rQZ8K9mN2pL3vX7yE5tW8eF6gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'administrateur');

-- Insertion d'un éditeur par défaut
INSERT INTO users (nom, email, password_hash, role) VALUES
('Éditeur Cuisine', 'editeur@livresgourmands.net', '$2b$10$rQZ8K9mN2pL3vX7yE5tW8eF6gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'editeur');

-- Insertion d'un gestionnaire par défaut
INSERT INTO users (nom, email, password_hash, role) VALUES
('Gestionnaire Stock', 'gestionnaire@livresgourmands.net', '$2b$10$rQZ8K9mN2pL3vX7yE5tW8eF6gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'gestionnaire');

-- Insertion d'exemples d'ouvrages
INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) VALUES
('La Cuisine Française Traditionnelle', 'Marie-Claire Dubois', '978-2-123456-78-9', 'Un guide complet de la cuisine française avec plus de 200 recettes traditionnelles.', 29.99, 50, 1, '/images/cuisine-francaise.jpg'),
('Pâtisseries Faciles', 'Pierre Martin', '978-2-123456-79-6', 'Apprenez à faire des desserts délicieux avec des techniques simples.', 24.99, 30, 2, '/images/patisseries.jpg'),
('Cuisine Italienne Authentique', 'Giuseppe Rossi', '978-2-123456-80-2', 'Découvrez les secrets de la cuisine italienne traditionnelle.', 27.99, 40, 3, '/images/cuisine-italienne.jpg'),
('Recettes Végétariennes', 'Sophie Green', '978-2-123456-81-9', 'Plus de 150 recettes végétariennes savoureuses et équilibrées.', 22.99, 35, 4, '/images/vegetarien.jpg'),
('Cuisine Express', 'Marc Rapide', '978-2-123456-82-6', 'Des recettes rapides et délicieuses pour les repas du quotidien.', 19.99, 60, 5, '/images/cuisine-express.jpg'),
('Techniques de Chef', 'Alain Gastronome', '978-2-123456-83-3', 'Maîtrisez les techniques avancées de la haute cuisine.', 45.99, 20, 6, '/images/techniques-chef.jpg');


-- Triggers pour la gestion automatique


-- Trigger pour mettre à jour le stock lors d'une commande
DELIMITER //
CREATE TRIGGER update_stock_after_order
AFTER INSERT ON commande_items
FOR EACH ROW
BEGIN
    UPDATE ouvrages 
    SET stock = stock - NEW.quantite 
    WHERE id = NEW.ouvrage_id;
END//
DELIMITER ;

-- Trigger pour vérifier le stock avant ajout au panier
DELIMITER //
CREATE TRIGGER check_stock_before_cart
BEFORE INSERT ON panier_items
FOR EACH ROW
BEGIN
    DECLARE stock_disponible INT;
    SELECT stock INTO stock_disponible FROM ouvrages WHERE id = NEW.ouvrage_id;
    
    IF stock_disponible < NEW.quantite THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuffisant pour cet ouvrage';
    END IF;
END//
DELIMITER ;


-- Vues utiles


-- Vue pour les ouvrages avec leurs moyennes d'avis
CREATE VIEW ouvrages_avec_avis AS
SELECT 
    o.*,
    c.nom as categorie_nom,
    COALESCE(AVG(a.note), 0) as moyenne_notes,
    COUNT(a.id) as nombre_avis
FROM ouvrages o
LEFT JOIN categories c ON o.categorie_id = c.id
LEFT JOIN avis a ON o.id = a.ouvrage_id
WHERE o.stock > 0
GROUP BY o.id;

-- Vue pour les commandes avec détails
CREATE VIEW commandes_detaillees AS
SELECT 
    c.*,
    u.nom as client_nom,
    u.email as client_email,
    COUNT(ci.id) as nombre_articles,
    GROUP_CONCAT(CONCAT(ci.quantite, 'x ', o.titre) SEPARATOR ', ') as articles
FROM commandes c
JOIN users u ON c.client_id = u.id
LEFT JOIN commande_items ci ON c.id = ci.commande_id
LEFT JOIN ouvrages o ON ci.ouvrage_id = o.id
GROUP BY c.id;


-- Index supplémentaires pour les performances


-- Index composite pour les recherches
CREATE INDEX idx_ouvrages_recherche ON ouvrages(titre, auteur, prix);
CREATE INDEX idx_commandes_client_date ON commandes(client_id, date_commande);
CREATE INDEX idx_avis_ouvrage_note ON avis(ouvrage_id, note);


-- Procédures stockées utiles


-- Procédure pour nettoyer les paniers inactifs
DELIMITER //
CREATE PROCEDURE NettoyerPaniersInactifs()
BEGIN
    DELETE FROM panier_items WHERE panier_id IN (
        SELECT id FROM panier WHERE actif = false AND updated_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
    );
    DELETE FROM panier WHERE actif = false AND updated_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
END//
DELIMITER ;

-- Procédure pour calculer les statistiques de vente
DELIMITER //
CREATE PROCEDURE StatistiquesVentes(IN date_debut DATE, IN date_fin DATE)
BEGIN
    SELECT 
        c.nom as categorie,
        COUNT(ci.id) as nombre_ventes,
        SUM(ci.quantite) as quantite_totale,
        SUM(ci.quantite * ci.prix_unitaire) as chiffre_affaires
    FROM commande_items ci
    JOIN ouvrages o ON ci.ouvrage_id = o.id
    JOIN categories c ON o.categorie_id = c.id
    JOIN commandes co ON ci.commande_id = co.id
    WHERE co.date_commande BETWEEN date_debut AND date_fin
    AND co.statut = 'payee'
    GROUP BY c.id, c.nom
    ORDER BY chiffre_affaires DESC;
END//
DELIMITER ;
