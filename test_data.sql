-- =============================================
-- Données de test supplémentaires
-- Base de données : livresgourmands
-- =============================================

USE livresgourmands;

-- Insertion de clients de test
INSERT INTO users (nom, email, password_hash, role) VALUES
('Jean Dupont', 'jean.dupont@email.com', '$2b$10$rQZ8K9mN2pL3vX7yE5tW8eF6gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'client'),
('Marie Leblanc', 'marie.leblanc@email.com', '$2b$10$rQZ8K9mN2pL3vX7yE5tW8eF6gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'client'),
('Pierre Moreau', 'pierre.moreau@email.com', '$2b$10$rQZ8K9mN2pL3vX7yE5tW8eF6gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'client'),
('Sophie Martin', 'sophie.martin@email.com', '$2b$10$rQZ8K9mN2pL3vX7yE5tW8eF6gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'client');

-- Insertion d'ouvrages supplémentaires
INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) VALUES
('Boulangerie Artisanale', 'François Boulanger', '978-2-123456-84-0', 'Apprenez les techniques de boulangerie artisanale avec plus de 100 recettes.', 32.99, 25, 2, '/images/boulangerie.jpg'),
('Cuisine Thaï', 'Somchai Thai', '978-2-123456-85-7', 'Découvrez les saveurs authentiques de la cuisine thaïlandaise.', 28.99, 30, 3, '/images/cuisine-thai.jpg'),
('Recettes Sans Gluten', 'Emma SansGluten', '978-2-123456-86-4', 'Plus de 80 recettes délicieuses sans gluten pour tous les repas.', 26.99, 40, 4, '/images/sans-gluten.jpg'),
('Cuisine en 15 minutes', 'Raphaël Vite', '978-2-123456-87-1', 'Des recettes express pour cuisiner rapidement sans compromis sur le goût.', 21.99, 45, 5, '/images/15-minutes.jpg'),
('Haute Cuisine Moderne', 'Chef Étoilé', '978-2-123456-88-8', 'Techniques et recettes de la cuisine gastronomique contemporaine.', 55.99, 15, 6, '/images/haute-cuisine.jpg'),
('Cuisine Provençale', 'Mireille Provence', '978-2-123456-89-5', 'Les secrets de la cuisine du Sud de la France.', 31.99, 35, 1, '/images/provence.jpg'),
('Desserts Chocolat', 'Choco Lover', '978-2-123456-90-1', 'Plus de 60 recettes de desserts au chocolat pour tous les niveaux.', 27.99, 50, 2, '/images/chocolat.jpg'),
('Cuisine Indienne', 'Raj Indien', '978-2-123456-91-8', 'Voyagez en Inde à travers ses saveurs et épices authentiques.', 29.99, 25, 3, '/images/indienne.jpg');

-- Insertion d'avis de test
INSERT INTO avis (client_id, ouvrage_id, note, commentaire) VALUES
(4, 1, 5, 'Excellent livre ! Les recettes sont claires et délicieuses.'),
(4, 2, 4, 'Très bon livre de pâtisserie, parfait pour débuter.'),
(5, 1, 5, 'Un classique de la cuisine française, je recommande !'),
(5, 3, 4, 'Belles recettes italiennes, bien expliquées.'),
(6, 2, 5, 'Mes enfants adorent les desserts de ce livre !'),
(6, 4, 4, 'Recettes végétariennes variées et savoureuses.'),
(7, 3, 5, 'Authentique cuisine italienne, parfait !'),
(7, 5, 4, 'Idéal pour les repas rapides du quotidien.');

-- Insertion de commentaires en attente de validation
INSERT INTO commentaires (client_id, ouvrage_id, contenu, valide) VALUES
(4, 1, 'Ce livre m\'a vraiment aidé à améliorer ma cuisine française. Les techniques sont bien expliquées.', false),
(5, 2, 'Parfait pour apprendre la pâtisserie. Les photos sont magnifiques.', false),
(6, 3, 'Les recettes italiennes sont authentiques et délicieuses.', false),
(7, 4, 'Excellent choix pour ceux qui veulent manger végétarien sans se priver.', false);

-- Insertion d'une liste de cadeaux de test
INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage, description) VALUES
('Liste Mariage Marie & Pierre', 4, 'MARIAGE2024', 'Livres de cuisine pour notre nouvelle cuisine !'),
('Anniversaire Sophie', 5, 'ANNIV2024', 'Des livres de cuisine pour mon anniversaire');

-- Insertion d'articles dans les listes de cadeaux
INSERT INTO liste_items (liste_id, ouvrage_id, quantite_souhaitee) VALUES
(1, 1, 1),
(1, 2, 1),
(1, 3, 1),
(2, 4, 1),
(2, 5, 1);

-- Insertion d'une commande de test
INSERT INTO commandes (client_id, total, statut, adresse_livraison, mode_livraison, mode_paiement) VALUES
(4, 54.98, 'payee', '123 Rue de la Paix, 75001 Paris', 'Livraison standard', 'Carte bancaire'),
(5, 24.99, 'en_cours', '456 Avenue des Champs, 69000 Lyon', 'Livraison express', 'PayPal');

-- Insertion des articles de commande
INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES
(1, 1, 1, 29.99),
(1, 2, 1, 24.99),
(2, 2, 1, 24.99);

-- Insertion d'un paiement de test
INSERT INTO payments (commande_id, provider, provider_payment_id, statut, amount) VALUES
(1, 'stripe', 'pi_1234567890', 'succeeded', 54.98);

-- Création de paniers de test
INSERT INTO panier (client_id, actif) VALUES
(6, true),
(7, true);

-- Insertion d'articles dans les paniers
INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES
(1, 3, 1, 27.99),
(1, 4, 2, 22.99),
(2, 5, 1, 19.99),
(2, 6, 1, 45.99);
