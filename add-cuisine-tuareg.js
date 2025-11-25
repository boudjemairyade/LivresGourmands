const mysql = require('mysql2/promise');
require('dotenv').config();

async function addCuisineTuareg() {
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

        // Insérer la catégorie
        console.log('\nAjout de la catégorie "Cuisine tuareg"...');
        
        await connection.execute(
            `INSERT INTO categories (nom, description) VALUES 
             ('Cuisine tuareg', 'Recettes authentiques de la cuisine touarègue, traditions culinaires du désert et du Sahara')
             ON DUPLICATE KEY UPDATE nom=nom`
        );

        // Récupérer l'ID de la catégorie
        const [tuaregCat] = await connection.execute(
            "SELECT id FROM categories WHERE nom = 'Cuisine tuareg'"
        );

        const tuaregId = tuaregCat[0]?.id;

        console.log(`   - Cuisine tuareg (ID: ${tuaregId})`);

        // Insérer les livres dans la catégorie "Cuisine tuareg"
        console.log('\nAjout des livres dans la catégorie "Cuisine tuareg"...');
        
        const tuaregBooks = [
            ['Cuisine Touarègue du Sahara', 'Ahmed Agadez', '978-2-234567-12-8', 'Découvrez les saveurs authentiques de la cuisine touarègue avec des recettes traditionnelles du désert. Plats à base de mil, dattes et viandes séchées.', 36.99, 25],
            ['Les Secrets de la Cuisine du Désert', 'Fatima Tamanrasset', '978-2-234567-13-5', 'Un voyage culinaire à travers les traditions touarègues. Apprenez à préparer les plats emblématiques du Sahara avec des techniques ancestrales.', 34.99, 30],
            ['Recettes Touarègues Traditionnelles', 'Mohamed Timbuktu', '978-2-234567-14-2', 'Plus de 80 recettes authentiques de la cuisine touarègue. Des plats simples et savoureux adaptés au mode de vie nomade.', 32.99, 35],
            ['Cuisine du Sahara', 'Aicha Djanet', '978-2-234567-15-9', 'Explorez la richesse culinaire du Sahara avec des recettes touarègues. Découvrez les ingrédients et techniques utilisés dans le désert.', 33.99, 28],
            ['Traditions Culinaires Touarègues', 'Ibrahim Agadez', '978-2-234567-16-6', 'Un recueil de recettes transmises oralement de génération en génération. Plongez dans l\'histoire et la culture touarègue à travers sa cuisine.', 37.99, 22],
            ['Cuisine Nomade du Désert', 'Zara Tassili', '978-2-234567-17-3', 'Les secrets de la cuisine nomade touarègue. Des recettes adaptées à la vie dans le désert avec des ingrédients locaux et des méthodes traditionnelles.', 35.99, 30]
        ];

        for (const [titre, auteur, isbn, description, prix, stock] of tuaregBooks) {
            try {
                await connection.execute(
                    `INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE titre=titre`,
                    [titre, auteur, isbn, description, prix, stock, tuaregId, '/images/cuisine-tuareg.jpg']
                );
                console.log(`   ${titre}`);
            } catch (error) {
                if (!error.message.includes('Duplicate entry')) {
                    console.error(`    Erreur pour "${titre}": ${error.message}`);
                } else {
                    console.log(`     "${titre}" existe déjà`);
                }
            }
        }

        // Vérifier les résultats
        const [totalBooks] = await connection.execute(
            `SELECT COUNT(*) as count FROM ouvrages o 
             JOIN categories c ON o.categorie_id = c.id 
             WHERE c.nom = 'Cuisine tuareg'`
        );
        
        console.log(`\nTotal de livres dans la catégorie "Cuisine tuareg": ${totalBooks[0].count}`);

        // Afficher tous les livres ajoutés
        const [sampleBooks] = await connection.execute(
            `SELECT o.titre, o.auteur, o.prix, o.stock 
             FROM ouvrages o 
             JOIN categories c ON o.categorie_id = c.id 
             WHERE c.nom = 'Cuisine tuareg' 
             ORDER BY o.titre`
        );
        
        console.log('\nLivres ajoutés dans la catégorie "Cuisine tuareg":');
        sampleBooks.forEach(book => {
            console.log(`   - ${book.titre} (${book.auteur}) - ${book.prix}€ - Stock: ${book.stock}`);
        });

        console.log('\nCatégorie "Cuisine tuareg" et livres ajoutés avec succès !');

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

addCuisineTuareg();

