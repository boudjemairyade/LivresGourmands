const readline = require('readline');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabasePassword() {
  console.log('Configuration du mot de passe MySQL\n');
  
  const envPath = path.join(__dirname, '.env');
  
  // Lire le fichier .env actuel
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else {
    console.log('ERREUR: Le fichier .env n\'existe pas !');
    process.exit(1);
  }

  // Tester différentes configurations
  console.log('Test de connexion à MySQL...\n');
  
  // Test 1: Sans mot de passe
  console.log('1. Test sans mot de passe...');
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'livresgourmands'
    });
    await connection.end();
    console.log('OK: Connexion réussie SANS mot de passe !\n');
    console.log('MySQL est configuré sans mot de passe.');
    console.log('Le fichier .env est déjà correctement configuré.\n');
    rl.close();
    return;
  } catch (error) {
    console.log('ERREUR: Échec sans mot de passe\n');
  }

  // Test 2: Demander le mot de passe
  console.log('2. MySQL nécessite un mot de passe.\n');
  const password = await question('Entrez le mot de passe MySQL pour l\'utilisateur "root": ');
  
  if (!password) {
    console.log('\nATTENTION: Aucun mot de passe fourni. Le fichier .env ne sera pas modifié.');
    rl.close();
    return;
  }

  // Tester la connexion avec le mot de passe
  console.log('\nTest de connexion avec le mot de passe fourni...');
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password,
      database: 'livresgourmands'
    });
    await connection.end();
    console.log('OK: Connexion réussie avec le mot de passe !\n');
    
    // Mettre à jour le fichier .env
    const updatedContent = envContent.replace(
      /^DB_PASSWORD=.*$/m,
      `DB_PASSWORD=${password}`
    );
    
    fs.writeFileSync(envPath, updatedContent, 'utf8');
    console.log('OK: Fichier .env mis à jour avec succès !');
    console.log('Vous pouvez maintenant redémarrer le serveur avec: npm run dev\n');
    
  } catch (error) {
    console.log('ERREUR: Échec de connexion avec ce mot de passe');
    console.log(`   Erreur: ${error.message}\n`);
    console.log('Vérifiez que:');
    console.log('   - Le mot de passe est correct');
    console.log('   - MySQL est démarré');
    console.log('   - La base de données "livresgourmands" existe\n');
  }
  
  rl.close();
}

setupDatabasePassword().catch(error => {
  console.error('Erreur:', error);
  rl.close();
  process.exit(1);
});

