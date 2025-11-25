const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Charger le fichier .env explicitement
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    console.warn('ATTENTION: Fichier .env non trouvé. Utilisation des valeurs par défaut.');
    require('dotenv').config();
}

const { testConnection } = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth');
const ouvrageRoutes = require('./routes/ouvrages');
const categorieRoutes = require('./routes/categories');
const panierRoutes = require('./routes/panier');
const favorisRoutes = require('./routes/favoris');
const commandesRoutes = require('./routes/commandes');
const listesCadeauxRoutes = require('./routes/listesCadeaux');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());

// Middleware CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true
}));

// Middleware de compression
app.use(compression());

// Middleware de logging
app.use(morgan('combined'));

// Middleware de limitation de taux
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite chaque IP à 100 requêtes par windowMs
    message: {
        success: false,
        message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
    }
});
app.use(limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware pour servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/ouvrages', ouvrageRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/panier', panierRoutes);
app.use('/api/favoris', favorisRoutes);
app.use('/api/commandes', commandesRoutes);
app.use('/api/listes-cadeaux', listesCadeauxRoutes);

// Route de test de l'API
app.get('/api/health', async (req, res) => {
    try {
        const dbConnected = await testConnection();
        res.json({
            success: true,
            message: 'API LivresGourmands fonctionnelle',
            timestamp: new Date().toISOString(),
            database: dbConnected ? 'connectée' : 'déconnectée',
            version: '1.0.0'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur de santé de l\'API',
            error: error.message
        });
    }
});

// Route racine
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API LivresGourmands - Site e-commerce de livres de cuisine',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            ouvrages: '/api/ouvrages',
            categories: '/api/categories',
            panier: '/api/panier'
        },
        documentation: 'Consultez le README.md pour plus d\'informations'
    });
});

// Middleware de gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl
    });
});

// Middleware de gestion globale des erreurs
app.use((error, req, res, next) => {
    console.error('Erreur globale:', error);
    
    // Erreur de validation Joi
    if (error.isJoi) {
        return res.status(400).json({
            success: false,
            message: 'Données invalides',
            errors: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }))
        });
    }

    // Erreur de base de données
    if (error.code && error.code.startsWith('ER_')) {
        return res.status(500).json({
            success: false,
            message: 'Erreur de base de données'
        });
    }

    // Erreur JWT
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expiré'
        });
    }

    // Erreur par défaut
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Erreur interne du serveur' 
            : error.message
    });
});

// Fonction pour démarrer le serveur
async function startServer() {
    try {
        // Vérifier les variables d'environnement critiques
        console.log('Verification des variables d\'environnement...');
        console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost (défaut)'}`);
        console.log(`   DB_USER: ${process.env.DB_USER || 'root (défaut)'}`);
        console.log(`   DB_NAME: ${process.env.DB_NAME || 'livresgourmands (défaut)'}`);
        console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***défini***' : 'NON DÉFINI'}`);
        console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '***défini***' : 'NON DÉFINI'}`);
        
        // Tester la connexion à la base de données
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('ERREUR: Impossible de se connecter à la base de données');
            console.error('Vérifiez que:');
            console.error('   1. MySQL est démarré');
            console.error('   2. Le fichier .env existe dans le dossier backend/');
            console.error('   3. DB_PASSWORD est correctement défini dans .env');
            console.error('   4. La base de données "livresgourmands" existe');
            process.exit(1);
        }

        // Démarrer le serveur
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
            console.log(`API LivresGourmands disponible sur http://localhost:${PORT}`);
            console.log(`Test de santé: http://localhost:${PORT}/api/health`);
            console.log(`Documentation: http://localhost:${PORT}/`);
        });

    } catch (error) {
        console.error('ERREUR lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

// Gestion des signaux d'arrêt
process.on('SIGTERM', () => {
    console.log('Signal SIGTERM reçu, arrêt du serveur...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Signal SIGINT reçu, arrêt du serveur...');
    process.exit(0);
});

// Démarrer le serveur
startServer();

module.exports = app;
