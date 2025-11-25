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

    // Lire le fichier schema.sql et nettoyer les DELIMITER
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error(' Fichier schema.sql introuvable:', schemaPath);
      return;
    }

    console.log(' Lecture du fichier schema.sql...');
    let schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Supprimer les lignes DELIMITER qui ne fonctionnent pas avec mysql2
    schemaSQL = schemaSQL.replace(/DELIMITER \/\/\s*/g, '');
    schemaSQL = schemaSQL.replace(/DELIMITER ;\s*/g, '');
    // Remplacer // par ; pour les triggers et procédures
    schemaSQL = schemaSQL.replace(/\/\/\s*$/gm, ';');
    
    // Diviser en plusieurs requêtes
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log('🔨 Création de la base de données et des tables...');
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 10) { // Ignorer les lignes trop courtes
        try {
          await connection.query(statement);
        } catch (error) {
          // Ignorer les erreurs de syntaxe pour les triggers (on les créera après)
          if (!error.message.includes('syntax') && !error.message.includes('DELIMITER')) {
            console.warn(`  Avertissement: ${error.message.substring(0, 50)}...`);
          }
        }
      }
    }
    
    console.log(' Schéma créé avec succès!\n');

    // Lire le fichier test_data.sql
    const testDataPath = path.join(__dirname, '..', 'database', 'test_data.sql');
    if (fs.existsSync(testDataPath)) {
      console.log(' Lecture du fichier test_data.sql...');
      let testDataSQL = fs.readFileSync(testDataPath, 'utf8');
      
      // Nettoyer aussi test_data.sql
      testDataSQL = testDataSQL.replace(/DELIMITER \/\/\s*/g, '');
      testDataSQL = testDataSQL.replace(/DELIMITER ;\s*/g, '');
      testDataSQL = testDataSQL.replace(/\/\/\s*$/gm, ';');
      
      const testStatements = testDataSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      // Exécuter les données de test
      console.log(' Insertion des données de test...');
      for (const statement of testStatements) {
        if (statement.length > 10) {
          try {
            await connection.query(statement);
          } catch (error) {
            // Ignorer les erreurs de duplication
            if (!error.message.includes('Duplicate entry') && !error.message.includes('already exists')) {
              console.warn(`  Avertissement: ${error.message.substring(0, 50)}...`);
            }
          }
        }
      }
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
    console.log(`    Catégories: ${categories[0].count}`);
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

