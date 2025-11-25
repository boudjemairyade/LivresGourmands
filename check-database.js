const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  let connection;
  
  try {
    console.log('Vérification de la connexion MySQL...\n');
    
    // Connexion à MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'mysql' // On se connecte d'abord à la base système
    });

    console.log('Connexion à MySQL réussie!\n');

    // Vérifier si la base de données existe
    const [databases] = await connection.execute("SHOW DATABASES LIKE 'livresgourmands'");
    
    if (databases.length === 0) {
      console.log('La base de données "livresgourmands" n\'existe pas encore.');
      console.log(' Vous devez exécuter: mysql -u root -p < database/schema.sql\n');
      await connection.end();
      return;
    }

    console.log('La base de données "livresgourmands" existe!\n');

    // Se connecter à la base livresgourmands
    await connection.end();
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'livresgourmands'
    });

    // Vérifier les tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(` Nombre de tables trouvées: ${tables.length}\n`);
    
    if (tables.length > 0) {
      console.log(' Liste des tables:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
      console.log('');
    }

    // Vérifier les données
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log(`Utilisateurs: ${users[0].count}`);

      const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
      console.log(`Catégories: ${categories[0].count}`);

      const [ouvrages] = await connection.execute('SELECT COUNT(*) as count FROM ouvrages');
      console.log(`Ouvrages: ${ouvrages[0].count}`);

      const [paniers] = await connection.execute('SELECT COUNT(*) as count FROM panier');
      console.log(`Paniers: ${paniers[0].count}`);

      const [avis] = await connection.execute('SELECT COUNT(*) as count FROM avis');
      console.log(`Avis: ${avis[0].count}\n`);

      // Afficher quelques exemples
      if (ouvrages[0].count > 0) {
        const [exemples] = await connection.execute('SELECT id, titre, auteur, prix FROM ouvrages LIMIT 3');
        console.log(' Exemples d\'ouvrages:');
        exemples.forEach(ouvrage => {
          console.log(`   - ${ouvrage.titre} par ${ouvrage.auteur} (${ouvrage.prix}€)`);
        });
        console.log('');
      }

      if (categories[0].count > 0) {
        const [cats] = await connection.execute('SELECT id, nom FROM categories');
        console.log(' Catégories disponibles:');
        cats.forEach(cat => {
          console.log(`   - ${cat.nom}`);
        });
      }

      console.log('\n La base de données est correctement configurée!');
      
    } catch (error) {
      console.log('  Certaines tables n\'existent pas encore.');
      console.log(' Exécutez: mysql -u root -p < database/schema.sql\n');
    }

  } catch (error) {
      console.error('Erreur lors de la vérification:');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n Vérifiez vos identifiants MySQL dans le fichier .env');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n Assurez-vous que MySQL est démarré');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n La base de données n\'existe pas. Exécutez: mysql -u root -p < database/schema.sql');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkDatabase();

