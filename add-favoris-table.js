const mysql = require('mysql2/promise');
require('dotenv').config();

async function addFavorisTable() {
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

        // Créer la table favoris
        console.log('Creation de la table favoris...\n');

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS favoris (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT NOT NULL,
                ouvrage_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
                UNIQUE KEY unique_client_ouvrage (client_id, ouvrage_id),
                INDEX idx_client (client_id),
                INDEX idx_ouvrage (ouvrage_id)
            )
        `);

        console.log('Table favoris creee avec succes !\n');

        // Vérifier la table
        const [tables] = await connection.execute(
            "SHOW TABLES LIKE 'favoris'"
        );

        if (tables.length > 0) {
            console.log('Verification: La table favoris existe bien.\n');
        }

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

addFavorisTable();


