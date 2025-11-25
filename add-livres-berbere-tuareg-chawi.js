const mysql = require('mysql2/promise');
require('dotenv').config();

async function addLivresBerbereTuaregChawi() {
    let connection;
    
    try {
        // Connexion à la base de données
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connexion à la base de données réussie\n');

        // Vérifier et créer les catégories si elles n'existent pas
        console.log('Verification des categories...\n');

        // Catégorie Tradition berbère
        let [berbereCat] = await connection.execute(
            'SELECT id FROM categories WHERE nom = ?',
            ['Tradition berbère']
        );
        let berbereId;
        if (berbereCat.length === 0) {
            const [result] = await connection.execute(
                'INSERT INTO categories (nom, description) VALUES (?, ?)',
                ['Tradition berbère', 'Livres sur la cuisine et les traditions berbères du Maghreb']
            );
            berbereId = result.insertId;
            console.log('Categorie "Tradition berbere" creee (ID: ' + berbereId + ')');
        } else {
            berbereId = berbereCat[0].id;
            console.log('Categorie "Tradition berbere" existe deja (ID: ' + berbereId + ')');
        }

        // Catégorie Cuisine tuareg
        let [tuaregCat] = await connection.execute(
            'SELECT id FROM categories WHERE nom = ?',
            ['Cuisine tuareg']
        );
        let tuaregId;
        if (tuaregCat.length === 0) {
            const [result] = await connection.execute(
                'INSERT INTO categories (nom, description) VALUES (?, ?)',
                ['Cuisine tuareg', 'Livres sur la cuisine touarègue du Sahara']
            );
            tuaregId = result.insertId;
            console.log('Categorie "Cuisine tuareg" creee (ID: ' + tuaregId + ')');
        } else {
            tuaregId = tuaregCat[0].id;
            console.log('Categorie "Cuisine tuareg" existe deja (ID: ' + tuaregId + ')');
        }

        // Catégorie Cuisine chawi
        let [chawiCat] = await connection.execute(
            'SELECT id FROM categories WHERE nom = ?',
            ['Cuisine chawi']
        );
        let chawiId;
        if (chawiCat.length === 0) {
            const [result] = await connection.execute(
                'INSERT INTO categories (nom, description) VALUES (?, ?)',
                ['Cuisine chawi', 'Livres sur la cuisine chaouie des Aurès']
            );
            chawiId = result.insertId;
            console.log('Categorie "Cuisine chawi" creee (ID: ' + chawiId + ')');
        } else {
            chawiId = chawiCat[0].id;
            console.log('Categorie "Cuisine chawi" existe deja (ID: ' + chawiId + ')');
        }

        // Ajouter les livres berbères
        console.log('\nAjout des livres dans la categorie "Tradition berbere"...');
        
        const berbereBooks = [
            ['Cuisine Berbère Authentique', 'Amina Tizi', '978-2-234567-06-7', 'Découvrez les saveurs authentiques de la cuisine berbère avec plus de 100 recettes traditionnelles. Des tajines, couscous et plats typiques du Maghreb.', 32.99, 30, '/images/cuisine-berbere.jpg'],
            ['Les Recettes de ma Grand-mère Berbère', 'Fatima Amazigh', '978-2-234567-07-4', 'Un recueil de recettes transmises de génération en génération. Plongez dans l\'histoire culinaire berbère avec des plats d\'exception.', 35.99, 25, '/images/cuisine-berbere.jpg'],
            ['Tajines et Couscous Berbères', 'Mohamed Atlas', '978-2-234567-08-1', 'Maîtrisez l\'art du tajine et du couscous avec des recettes traditionnelles berbères. Des plats parfumés aux épices et aux herbes du Maghreb.', 28.99, 40, '/images/cuisine-berbere.jpg'],
            ['Saveurs du Maghreb', 'Leila Kabyle', '978-2-234567-09-8', 'Un voyage culinaire à travers les régions berbères du Maghreb. Découvrez la diversité des saveurs et des traditions culinaires.', 31.99, 35, '/images/cuisine-berbere.jpg'],
            ['Cuisine Berbère Moderne', 'Youssef Rif', '978-2-234567-10-4', 'Une approche moderne de la cuisine berbère traditionnelle. Des recettes revisitées tout en respectant les saveurs authentiques.', 33.99, 30, '/images/cuisine-berbere.jpg'],
            ['Les Épices Berbères', 'Hassan Souss', '978-2-234567-11-1', 'Guide complet sur les épices utilisées dans la cuisine berbère. Apprenez à les utiliser et à créer des mélanges parfumés.', 27.99, 45, '/images/cuisine-berbere.jpg']
        ];

        for (const [titre, auteur, isbn, description, prix, stock, image_url] of berbereBooks) {
            try {
                await connection.execute(
                    `INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE titre=titre`,
                    [titre, auteur, isbn, description, prix, stock, berbereId, image_url]
                );
                console.log('   ' + titre);
            } catch (error) {
                if (!error.message.includes('Duplicate entry')) {
                    console.error('   Erreur pour "' + titre + '": ' + error.message);
                }
            }
        }

        // Ajouter les livres tuaregs
        console.log('\nAjout des livres dans la categorie "Cuisine tuareg"...');
        
        const tuaregBooks = [
            ['Cuisine Touarègue du Sahara', 'Ahmed Agadez', '978-2-234567-12-8', 'Découvrez les saveurs authentiques de la cuisine touarègue avec des recettes traditionnelles du désert. Plats à base de mil, dattes et viandes séchées.', 36.99, 25, '/images/cuisine-tuareg.jpg'],
            ['Les Secrets de la Cuisine du Désert', 'Fatima Tamanrasset', '978-2-234567-13-5', 'Un voyage culinaire à travers les traditions touarègues. Apprenez à préparer les plats emblématiques du Sahara avec des techniques ancestrales.', 34.99, 30, '/images/cuisine-tuareg.jpg'],
            ['Recettes Touarègues Traditionnelles', 'Mohamed Timbuktu', '978-2-234567-14-2', 'Plus de 80 recettes authentiques de la cuisine touarègue. Des plats simples et savoureux adaptés au mode de vie nomade.', 32.99, 35, '/images/cuisine-tuareg.jpg'],
            ['Cuisine du Sahara', 'Aicha Djanet', '978-2-234567-15-9', 'Explorez la richesse culinaire du Sahara avec des recettes touarègues. Découvrez les ingrédients et techniques utilisés dans le désert.', 33.99, 28, '/images/cuisine-tuareg.jpg'],
            ['Traditions Culinaires Touarègues', 'Ibrahim Agadez', '978-2-234567-16-6', 'Un recueil de recettes transmises oralement de génération en génération. Plongez dans l\'histoire et la culture touarègue à travers sa cuisine.', 37.99, 22, '/images/cuisine-tuareg.jpg'],
            ['Cuisine Nomade du Désert', 'Zara Tassili', '978-2-234567-17-3', 'Les secrets de la cuisine nomade touarègue. Des recettes adaptées à la vie dans le désert avec des ingrédients locaux et des méthodes traditionnelles.', 35.99, 30, '/images/cuisine-tuareg.jpg']
        ];

        for (const [titre, auteur, isbn, description, prix, stock, image_url] of tuaregBooks) {
            try {
                await connection.execute(
                    `INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE titre=titre`,
                    [titre, auteur, isbn, description, prix, stock, tuaregId, image_url]
                );
                console.log('   ' + titre);
            } catch (error) {
                if (!error.message.includes('Duplicate entry')) {
                    console.error('   Erreur pour "' + titre + '": ' + error.message);
                }
            }
        }

        // Ajouter les livres chawis
        console.log('\nAjout des livres dans la categorie "Cuisine chawi"...');
        
        const chawiBooks = [
            ['Cuisine Chaouie des Aurès', 'Khadidja Batna', '978-2-234567-18-0', 'Découvrez les saveurs authentiques de la cuisine chaouie avec des recettes traditionnelles des Aurès. Plats à base de blé, légumes et viandes.', 34.99, 30, '/images/cuisine-berbere.jpg'],
            ['Recettes Traditionnelles Chaouies', 'Mohamed Khenchela', '978-2-234567-19-7', 'Un recueil de recettes transmises de génération en génération dans les montagnes des Aurès. Découvrez la cuisine chaouie authentique.', 32.99, 35, '/images/cuisine-berbere.jpg'],
            ['Saveurs des Aurès', 'Fatima Batna', '978-2-234567-20-3', 'Un voyage culinaire à travers les traditions chaouies. Apprenez à préparer les plats emblématiques des Aurès avec des techniques traditionnelles.', 33.99, 28, '/images/cuisine-berbere.jpg'],
            ['Cuisine Chaouie Moderne', 'Youssef Tébessa', '978-2-234567-21-0', 'Une approche moderne de la cuisine chaouie traditionnelle. Des recettes revisitées tout en respectant les saveurs authentiques des Aurès.', 35.99, 25, '/images/cuisine-berbere.jpg'],
            ['Les Plats des Montagnes Chaouies', 'Aicha Khenchela', '978-2-234567-22-7', 'Explorez la richesse culinaire des montagnes chaouies. Découvrez les ingrédients et techniques utilisés dans la cuisine des Aurès.', 31.99, 32, '/images/cuisine-berbere.jpg'],
            ['Traditions Culinaires Chaouies', 'Ibrahim Batna', '978-2-234567-23-4', 'Un recueil de recettes transmises oralement dans la culture chaouie. Plongez dans l\'histoire et la culture chaouie à travers sa cuisine.', 36.99, 22, '/images/cuisine-berbere.jpg']
        ];

        for (const [titre, auteur, isbn, description, prix, stock, image_url] of chawiBooks) {
            try {
                await connection.execute(
                    `INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id, image_url) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE titre=titre`,
                    [titre, auteur, isbn, description, prix, stock, chawiId, image_url]
                );
                console.log('   ' + titre);
            } catch (error) {
                if (!error.message.includes('Duplicate entry')) {
                    console.error('   Erreur pour "' + titre + '": ' + error.message);
                }
            }
        }

        // Vérifier les résultats
        console.log('\nVerification des resultats...\n');

        const [totalBerbere] = await connection.execute(
            `SELECT COUNT(*) as count FROM ouvrages WHERE categorie_id = ?`,
            [berbereId]
        );
        console.log('Total de livres dans "Tradition berbere": ' + totalBerbere[0].count);

        const [totalTuareg] = await connection.execute(
            `SELECT COUNT(*) as count FROM ouvrages WHERE categorie_id = ?`,
            [tuaregId]
        );
        console.log('Total de livres dans "Cuisine tuareg": ' + totalTuareg[0].count);

        const [totalChawi] = await connection.execute(
            `SELECT COUNT(*) as count FROM ouvrages WHERE categorie_id = ?`,
            [chawiId]
        );
        console.log('Total de livres dans "Cuisine chawi": ' + totalChawi[0].count);

        console.log('\nLivres ajoutes avec succes !');

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

addLivresBerbereTuaregChawi();


