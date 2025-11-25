const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateBookCovers() {
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

        // Mapping des catégories vers leurs images de couverture
        const categoryImages = {
            'Cuisine Française': '/images/cuisine-francaise.jpg',
            'Pâtisserie': '/images/patisserie.jpg',
            'Cuisine du Monde': '/images/cuisine-monde.jpg',
            'Cuisine Végétarienne': '/images/vegetarien.jpg',
            'Cuisine Express': '/images/cuisine-express.jpg',
            'Cuisine Rapide': '/images/cuisine-express.jpg',
            'Techniques de Chef': '/images/techniques-chef.jpg',
            'Cuisine Gastronomique': '/images/techniques-chef.jpg',
            'Cuisine': '/images/cuisine-generale.jpg',
            'Tradition berbère': '/images/cuisine-berbere.jpg',
            'Cuisine tuareg': '/images/cuisine-tuareg.jpg'
        };

        // Récupérer toutes les catégories
        const [categories] = await connection.execute(
            'SELECT id, nom FROM categories'
        );

        console.log('\nMise à jour des images de couverture par catégorie...\n');

        // Pour chaque catégorie, mettre à jour les images des livres
        for (const category of categories) {
            const imageUrl = categoryImages[category.nom] || '/images/cuisine-generale.jpg';
            
            // Mettre à jour tous les livres de cette catégorie
            const [result] = await connection.execute(
                `UPDATE ouvrages 
                 SET image_url = ? 
                 WHERE categorie_id = ?`,
                [imageUrl, category.id]
            );

            // Compter les livres mis à jour
            const [count] = await connection.execute(
                'SELECT COUNT(*) as total FROM ouvrages WHERE categorie_id = ?',
                [category.id]
            );

            console.log(`   ${category.nom}: ${count[0].total} livre(s) mis à jour avec ${imageUrl}`);
        }

        // Afficher quelques exemples de livres mis à jour
        console.log('\nExemples de livres mis à jour:');
        const [sampleBooks] = await connection.execute(
            `SELECT o.titre, o.image_url, c.nom as categorie 
             FROM ouvrages o 
             JOIN categories c ON o.categorie_id = c.id 
             ORDER BY c.nom, o.titre 
             LIMIT 15`
        );
        
        sampleBooks.forEach(book => {
            console.log(`   - ${book.titre} (${book.categorie}) -> ${book.image_url}`);
        });

        console.log('\nMise à jour des images de couverture terminée avec succès !');

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

updateBookCovers();

