const mysql = require('mysql2/promise');
require('dotenv').config();

async function addCategoriesAndBooks() {
    let connection;
    
    try {
        // Connexion à la base de données
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connexion à la base de données réussie');

        // Insérer les catégories
        console.log('\nAjout des catégories...');
        
        await connection.execute(
            `INSERT INTO categories (nom, description) VALUES 
             ('Cuisine', 'Livres de cuisine générale et recettes variées pour tous les goûts'),
             ('Tradition berbère', 'Recettes authentiques de la cuisine berbère traditionnelle')
             ON DUPLICATE KEY UPDATE nom=nom`
        );

        // Récupérer les IDs des catégories
        const [cuisineCat] = await connection.execute(
            "SELECT id FROM categories WHERE nom = 'Cuisine'"
        );
        const [berbereCat] = await connection.execute(
            "SELECT id FROM categories WHERE nom = 'Tradition berbère'"
        );

        const cuisineId = cuisineCat[0]?.id;
        const berbereId = berbereCat[0]?.id;

        console.log(`   - Cuisine (ID: ${cuisineId})`);
        console.log(`   - Tradition berbère (ID: ${berbereId})`);

        // Insérer les livres dans la catégorie "Cuisine"
        console.log('\nAjout des livres dans la catégorie "Cuisine"...');
        
        const cuisineBooks = [
            ['Le Grand Livre de la Cuisine', 'Chef Émilien', '978-2-234567-01-2', 'Un ouvrage complet avec plus de 500 recettes de cuisine pour tous les jours. Des plats simples aux préparations plus élaborées, découvrez l\'art de bien cuisiner.', 39.99, 45],
            ['Cuisine Facile pour Tous', 'Marie Cuisine', '978-2-234567-02-9', 'Des recettes simples et délicieuses pour cuisiner au quotidien sans se compliquer la vie. Parfait pour les débutants et les cuisiniers pressés.', 24.99, 60],
            ['Les Secrets de la Cuisine', 'Antoine Gourmet', '978-2-234567-03-6', 'Découvrez les techniques et astuces des grands chefs pour réussir tous vos plats. Un guide pratique avec des explications détaillées.', 34.99, 35],
            ['Cuisine du Quotidien', 'Sophie Pratique', '978-2-234567-04-3', 'Recettes économiques et savoureuses pour toute la famille. Des plats équilibrés et faciles à préparer pour les repas de tous les jours.', 22.99, 50],
            ['Cuisine Traditionnelle', 'Pierre Classique', '978-2-234567-05-0', 'Les recettes classiques de la cuisine française et internationale. Un retour aux sources avec des plats intemporels.', 29.99, 40]
        ];

        for (const [titre, auteur, isbn, description, prix, stock] of cuisineBooks) {
            try {
                await connection.execute(
                    `INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE titre=titre`,
                    [titre, auteur, isbn, description, prix, stock, cuisineId, '/images/cuisine-generale.jpg']
                );
                console.log(`    ${titre}`);
            } catch (error) {
                if (!error.message.includes('Duplicate entry')) {
                    console.error(`    Erreur pour "${titre}": ${error.message}`);
                }
            }
        }

        // Insérer les livres dans la catégorie "Tradition berbère"
        console.log('\nAjout des livres dans la catégorie "Tradition berbère"...');
        
        const berbereBooks = [
            ['Cuisine Berbère Authentique', 'Amina Tizi', '978-2-234567-06-7', 'Découvrez les saveurs authentiques de la cuisine berbère avec plus de 100 recettes traditionnelles. Des tajines, couscous et plats typiques du Maghreb.', 32.99, 30],
            ['Les Recettes de ma Grand-mère Berbère', 'Fatima Amazigh', '978-2-234567-07-4', 'Un recueil de recettes transmises de génération en génération. Plongez dans l\'histoire culinaire berbère avec des plats d\'exception.', 35.99, 25],
            ['Tajines et Couscous Berbères', 'Mohamed Atlas', '978-2-234567-08-1', 'Maîtrisez l\'art du tajine et du couscous avec des recettes traditionnelles berbères. Des plats parfumés aux épices et aux herbes du Maghreb.', 28.99, 40],
            ['Saveurs du Maghreb', 'Leila Kabyle', '978-2-234567-09-8', 'Un voyage culinaire à travers les régions berbères du Maghreb. Découvrez la diversité des saveurs et des traditions culinaires.', 31.99, 35],
            ['Cuisine Berbère Moderne', 'Youssef Rif', '978-2-234567-10-4', 'Une approche moderne de la cuisine berbère traditionnelle. Des recettes revisitées tout en respectant les saveurs authentiques.', 33.99, 30],
            ['Les Épices Berbères', 'Hassan Souss', '978-2-234567-11-1', 'Guide complet sur les épices utilisées dans la cuisine berbère. Apprenez à les utiliser et à créer des mélanges parfumés.', 27.99, 45]
        ];

        for (const [titre, auteur, isbn, description, prix, stock] of berbereBooks) {
            try {
                await connection.execute(
                    `INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE titre=titre`,
                    [titre, auteur, isbn, description, prix, stock, berbereId, '/images/cuisine-berbere.jpg']
                );
                console.log(`    ${titre}`);
            } catch (error) {
                if (!error.message.includes('Duplicate entry')) {
                    console.error(`    Erreur pour "${titre}": ${error.message}`);
                }
            }
        }

        // Vérifier les résultats
        const [totalBooks] = await connection.execute(
            `SELECT COUNT(*) as count FROM ouvrages o 
             JOIN categories c ON o.categorie_id = c.id 
             WHERE c.nom IN ('Cuisine', 'Tradition berbère')`
        );
        
        console.log(`\nTotal de livres dans ces catégories: ${totalBooks[0].count}`);

        // Afficher quelques exemples
        const [sampleBooks] = await connection.execute(
            `SELECT o.titre, o.auteur, c.nom as categorie, o.prix 
             FROM ouvrages o 
             JOIN categories c ON o.categorie_id = c.id 
             WHERE c.nom IN ('Cuisine', 'Tradition berbère') 
             ORDER BY c.nom, o.titre 
             LIMIT 10`
        );
        
        console.log('\nExemples de livres ajoutés:');
        sampleBooks.forEach(book => {
            console.log(`   - ${book.titre} (${book.categorie}) - ${book.prix}€`);
        });

        console.log('\nCatégories et livres ajoutés avec succès !');

    } catch (error) {
        console.error('Erreur:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

addCategoriesAndBooks();
