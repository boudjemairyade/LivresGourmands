const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

console.log('Verification de la configuration .env...\n');

// Vérifier si .env existe
if (!fs.existsSync(envPath)) {
    console.log('ERREUR: Le fichier .env n\'existe pas !');
    if (fs.existsSync(envExamplePath)) {
        console.log('Copie de env.example vers .env...');
        fs.copyFileSync(envExamplePath, envPath);
        console.log('Fichier .env créé. Veuillez le modifier avec vos informations.');
    } else {
        console.log('ERREUR: Le fichier env.example n\'existe pas non plus !');
    }
    process.exit(1);
}

// Charger et vérifier les variables
require('dotenv').config({ path: envPath });

const requiredVars = {
    'DB_HOST': process.env.DB_HOST,
    'DB_PORT': process.env.DB_PORT,
    'DB_NAME': process.env.DB_NAME,
    'DB_USER': process.env.DB_USER,
    'DB_PASSWORD': process.env.DB_PASSWORD,
    'JWT_SECRET': process.env.JWT_SECRET
};

console.log('Variables d\'environnement:');
let hasErrors = false;

for (const [key, value] of Object.entries(requiredVars)) {
    if (value === undefined || value === '') {
        console.log(`   ERREUR: ${key}: NON DÉFINI ou VIDE`);
        hasErrors = true;
    } else if (key === 'DB_PASSWORD' || key === 'JWT_SECRET') {
        console.log(`   OK: ${key}: ***défini*** (${value.length} caractères)`);
    } else {
        console.log(`   OK: ${key}: ${value}`);
    }
}

if (hasErrors) {
    console.log('\nATTENTION: Certaines variables sont manquantes ou vides.');
    console.log('Modifiez le fichier backend/.env avec vos informations:');
    console.log('   - DB_PASSWORD: votre mot de passe MySQL');
    console.log('   - JWT_SECRET: une chaîne secrète pour les tokens JWT');
    console.log('\nExemple:');
    console.log('   DB_PASSWORD=votre_mot_de_passe_mysql');
    console.log('   JWT_SECRET=une_chaine_secrete_tres_longue_et_aleatoire');
    process.exit(1);
} else {
    console.log('\nOK: Toutes les variables d\'environnement sont définies !');
    process.exit(0);
}

