-- =============================================
-- Ajout des catégories "Cuisine" et "Tradition berbère"
-- et insertion de livres dans ces catégories
-- =============================================

USE livresgourmands;

-- Insertion des nouvelles catégories
INSERT INTO categories (nom, description) VALUES
('Cuisine', 'Livres de cuisine générale et recettes variées pour tous les goûts'),
('Tradition berbère', 'Recettes authentiques de la cuisine berbère traditionnelle')
ON DUPLICATE KEY UPDATE nom=nom;

-- Récupérer les IDs des catégories créées
SET @categorie_cuisine_id = (SELECT id FROM categories WHERE nom = 'Cuisine' LIMIT 1);
SET @categorie_berbere_id = (SELECT id FROM categories WHERE nom = 'Tradition berbère' LIMIT 1);

-- Insertion de livres dans la catégorie "Cuisine"
INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) VALUES
('Le Grand Livre de la Cuisine', 'Chef Émilien', '978-2-234567-01-2', 'Un ouvrage complet avec plus de 500 recettes de cuisine pour tous les jours. Des plats simples aux préparations plus élaborées, découvrez l\'art de bien cuisiner.', 39.99, 45, @categorie_cuisine_id, '/images/cuisine-generale.jpg'),
('Cuisine Facile pour Tous', 'Marie Cuisine', '978-2-234567-02-9', 'Des recettes simples et délicieuses pour cuisiner au quotidien sans se compliquer la vie. Parfait pour les débutants et les cuisiniers pressés.', 24.99, 60, @categorie_cuisine_id, '/images/cuisine-facile.jpg'),
('Les Secrets de la Cuisine', 'Antoine Gourmet', '978-2-234567-03-6', 'Découvrez les techniques et astuces des grands chefs pour réussir tous vos plats. Un guide pratique avec des explications détaillées.', 34.99, 35, @categorie_cuisine_id, '/images/secrets-cuisine.jpg'),
('Cuisine du Quotidien', 'Sophie Pratique', '978-2-234567-04-3', 'Recettes économiques et savoureuses pour toute la famille. Des plats équilibrés et faciles à préparer pour les repas de tous les jours.', 22.99, 50, @categorie_cuisine_id, '/images/cuisine-quotidien.jpg'),
('Cuisine Traditionnelle', 'Pierre Classique', '978-2-234567-05-0', 'Les recettes classiques de la cuisine française et internationale. Un retour aux sources avec des plats intemporels.', 29.99, 40, @categorie_cuisine_id, '/images/cuisine-traditionnelle.jpg')
ON DUPLICATE KEY UPDATE titre=titre;

-- Insertion de livres dans la catégorie "Tradition berbère"
INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) VALUES
('Cuisine Berbère Authentique', 'Amina Tizi', '978-2-234567-06-7', 'Découvrez les saveurs authentiques de la cuisine berbère avec plus de 100 recettes traditionnelles. Des tajines, couscous et plats typiques du Maghreb.', 32.99, 30, @categorie_berbere_id, '/images/cuisine-berbere.jpg'),
('Les Recettes de ma Grand-mère Berbère', 'Fatima Amazigh', '978-2-234567-07-4', 'Un recueil de recettes transmises de génération en génération. Plongez dans l\'histoire culinaire berbère avec des plats d\'exception.', 35.99, 25, @categorie_berbere_id, '/images/recettes-grand-mere.jpg'),
('Tajines et Couscous Berbères', 'Mohamed Atlas', '978-2-234567-08-1', 'Maîtrisez l\'art du tajine et du couscous avec des recettes traditionnelles berbères. Des plats parfumés aux épices et aux herbes du Maghreb.', 28.99, 40, @categorie_berbere_id, '/images/tajines-couscous.jpg'),
('Saveurs du Maghreb', 'Leila Kabyle', '978-2-234567-09-8', 'Un voyage culinaire à travers les régions berbères du Maghreb. Découvrez la diversité des saveurs et des traditions culinaires.', 31.99, 35, @categorie_berbere_id, '/images/saveurs-maghreb.jpg'),
('Cuisine Berbère Moderne', 'Youssef Rif', '978-2-234567-10-4', 'Une approche moderne de la cuisine berbère traditionnelle. Des recettes revisitées tout en respectant les saveurs authentiques.', 33.99, 30, @categorie_berbere_id, '/images/berbere-moderne.jpg'),
('Les Épices Berbères', 'Hassan Souss', '978-2-234567-11-1', 'Guide complet sur les épices utilisées dans la cuisine berbère. Apprenez à les utiliser et à créer des mélanges parfumés.', 27.99, 45, @categorie_berbere_id, '/images/epices-berberes.jpg')
ON DUPLICATE KEY UPDATE titre=titre;

-- Message de confirmation
SELECT 'Catégories et livres ajoutés avec succès !' as message;

