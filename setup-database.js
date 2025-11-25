const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log(' Configuration de la base de données...\n');
    
    // Connexion à MySQL sans spécifier de base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log(' Connexion à MySQL réussie!\n');

    // Lire le fichier schema.sql
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error(' Fichier schema.sql introuvable:', schemaPath);
      return;
    }

    console.log(' Lecture du fichier schema.sql...');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Exécuter le schéma
    console.log(' Création de la base de données et des tables...');
    await connection.query(schemaSQL);
    console.log(' Schéma créé avec succès!\n');

    // Lire le fichier test_data.sql
    const testDataPath = path.join(__dirname, '..', 'database', 'test_data.sql');
    if (fs.existsSync(testDataPath)) {
      console.log(' Lecture du fichier test_data.sql...');
      const testDataSQL = fs.readFileSync(testDataPath, 'utf8');
      
      // Exécuter les données de test
      console.log(' Insertion des données de test...');
      await connection.query(testDataSQL);
      console.log(' Données de test insérées avec succès!\n');
    } else {
      console.log('  Fichier test_data.sql introuvable, passage de l\'insertion des données de test.\n');
    }

    // Vérifier les données
    await connection.query('USE livresgourmands');
    
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    const [ouvrages] = await connection.execute('SELECT COUNT(*) as count FROM ouvrages');
    
    console.log(' Résumé de la base de données:');
    console.log(`    Utilisateurs: ${users[0].count}`);
    console.log(`   Catégories: ${categories[0].count}`);
    console.log(`    Ouvrages: ${ouvrages[0].count}\n`);
    
    console.log(' Base de données configurée avec succès!');
    console.log(' Vous pouvez maintenant démarrer le serveur avec: npm start\n');

  } catch (error) {
    console.error(' Erreur lors de la configuration:');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n Vérifiez vos identifiants MySQL dans le fichier .env');
      console.log('   DB_USER=root');
      console.log('   DB_PASSWORD=votre_mot_de_passe');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n Assurez-vous que MySQL est démarré');
    } else if (error.sqlMessage) {
      console.log('\n Erreur SQL:', error.sqlMessage);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();

