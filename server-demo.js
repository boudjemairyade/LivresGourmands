const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

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
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
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

// Routes de base pour tester
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API LivresGourmands fonctionnelle',
        timestamp: new Date().toISOString(),
        database: 'Non configurée (mode démo)',
        version: '1.0.0'
    });
});

// Route racine
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API LivresGourmands - Site e-commerce de livres de cuisine',
        version: '1.0.0',
        status: 'Mode démo - Base de données non configurée',
        endpoints: {
            health: '/api/health',
            demo: '/api/demo'
        },
        documentation: 'Consultez le README.md pour plus d\'informations'
    });
});

// Route de démonstration
app.get('/api/demo', (req, res) => {
    res.json({
        success: true,
        message: 'Mode démonstration activé',
        data: {
            ouvrages: [
                {
                    id: 1,
                    titre: "La Cuisine Française Traditionnelle",
                    auteur: "Marie-Claire Dubois",
                    prix: 29.99,
                    stock: 50,
                    categorie: "Cuisine Française"
                },
                {
                    id: 2,
                    titre: "Pâtisseries Faciles",
                    auteur: "Pierre Martin",
                    prix: 24.99,
                    stock: 30,
                    categorie: "Pâtisserie"
                }
            ],
            categories: [
                { id: 1, nom: "Cuisine Française" },
                { id: 2, nom: "Pâtisserie" },
                { id: 3, nom: "Cuisine du Monde" }
            ]
        }
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
        app.listen(PORT, () => {
            console.log(` Serveur démarré sur le port ${PORT}`);
            console.log(` API LivresGourmands disponible sur http://localhost:${PORT}`);
            console.log(` Test de santé: http://localhost:${PORT}/api/health`);
            console.log(` Documentation: http://localhost:${PORT}/`);
            console.log(` Mode démo: http://localhost:${PORT}/api/demo`);
            console.log('');
            console.log('  Mode démonstration - Base de données non configurée');
            console.log(' Pour configurer MySQL, suivez le guide d\'installation');
        });

    } catch (error) {
        console.error(' Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

// Gestion des signaux d'arrêt
process.on('SIGTERM', () => {
    console.log(' Signal SIGTERM reçu, arrêt du serveur...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('X  Signal SIGINT reçu, arrêt du serveur...');
    process.exit(0);
});

// Démarrer le serveur
startServer();

module.exports = app;
