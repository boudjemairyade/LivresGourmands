const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUserPassword() {
  let connection;
  
  try {
    console.log('Vérification du mot de passe de l\'utilisateur...\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'livresgourmands'
    });

    const email = 'boudjemairyade57@gmail.com';
    
    const [users] = await connection.execute(
      'SELECT id, nom, email, password_hash, role, actif FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log(' Utilisateur non trouvé');
      return;
    }

    const user = users[0];
    console.log(' Utilisateur trouvé:');
    console.log('  - ID:', user.id);
    console.log('  - Nom:', user.nom);
    console.log('  - Email:', user.email);
    console.log('  - Role:', user.role);
    console.log('  - Actif:', user.actif, '(type:', typeof user.actif, ')');
    console.log('  - Password hash existe:', !!user.password_hash);
    console.log('  - Password hash length:', user.password_hash ? user.password_hash.length : 0);
    console.log('  - Password hash preview:', user.password_hash ? user.password_hash.substring(0, 20) + '...' : 'NULL');

    if (!user.password_hash) {
      console.log('\n  ATTENTION: Le password_hash est NULL!');
      console.log('   Il faut réinitialiser le mot de passe de cet utilisateur.');
    }

  } catch (error) {
    console.error(' Erreur:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkUserPassword();

