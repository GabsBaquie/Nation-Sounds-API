# 🎵 Nation Sounds API

API backend pour l'application Nation Sounds - Gestion des concerts, jours, POIs et informations de sécurité.

## 📁 Structure du projet

```
nation-sounds-api/
├── 📁 src/                          # Code source TypeScript
│   ├── controllers/                  # Contrôleurs API
│   ├── database/                    # Gestion de la base de données
│   ├── dto/                         # Data Transfer Objects
│   ├── middleware/                  # Middlewares Express
│   ├── routes/                      # Routes API
│   ├── services/                    # Services métier
│   ├── types/                       # Types TypeScript
│   └── utils/                       # Utilitaires
├── 📁 database/                     # Scripts et vues SQL
│   ├── migrations/                  # Migrations SQL
│   └── views/                       # Vues SQL
├── 📁 scripts/                      # Scripts utilitaires
│   ├── database/                    # Scripts de gestion DB
│   ├── testing/                     # Scripts de test
│   ├── run-tests.js                 # Gestionnaire de tests
│   └── setup-env.js                 # Configuration environnement
├── 📁 tests/                        # Tests d'intégration
│   └── start-and-test.sh            # Script de test complet
├── 📁 docs/                         # Documentation
│   ├── API_GUIDE.md                 # Guide de l'API
│   └── SUPABASE_SETUP.md            # Configuration Supabase
├── 📁 config/                       # Configuration
│   ├── tsconfig.json                # Configuration TypeScript
│   └── jest.config.js               # Configuration Jest
├── db.js                            # Gestionnaire de base de données
└── package.json                     # Dépendances
```

## 🚀 Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration

```bash
# Configurer l'environnement de test
node scripts/setup-env.js

# Initialiser la base de données
node db.js init

# Créer les vues
node db.js views
```

### 3. Démarrage

```bash
# Mode développement
npm run dev

# Mode test
NODE_ENV=test node dist/index.js --start-server
```

## 🧪 Tests

### Tests unitaires

```bash
npm test
```

### Tests d'intégration

```bash
node scripts/run-tests.js integration
```

### Test de l'API

```bash
node scripts/run-tests.js api
```

### Tous les tests

```bash
node scripts/run-tests.js all
```

## 🗄️ Base de données

### Gestion de la base

```bash
node db.js init          # Initialiser
node db.js views         # Créer les vues
node db.js test          # Tester les vues
node db.js all           # Tout faire
```

### Vues disponibles

- `full_db` - Toutes les données
- `public_data` - Données publiques
- `db_stats` - Statistiques par table
- `poi_stats_by_type` - Statistiques POIs
- `concerts_by_month` - Concerts par mois
- `recent_activity` - Activité récente

## 📊 Endpoints API

### Données publiques

- `GET /api/stats/public-data` - Données publiques
- `GET /api/stats/stats` - Statistiques générales
- `GET /api/stats/poi-stats` - Statistiques POIs
- `GET /api/stats/concerts-by-month` - Concerts par mois

### Données protégées (authentification requise)

- `GET /api/stats/all-data` - Toutes les données
- `GET /api/admin/users` - Gestion des utilisateurs
- `POST /api/admin/users` - Créer un utilisateur

### CRUD standard

- `GET/POST/PUT/DELETE /api/concerts` - Concerts
- `GET/POST/PUT/DELETE /api/days` - Jours
- `GET/POST/PUT/DELETE /api/pois` - POIs
- `GET/POST/PUT/DELETE /api/securityInfos` - Infos sécurité

## 🔧 Scripts utiles

### Configuration

```bash
node scripts/setup-env.js      # Configurer .env.test
node scripts/test-connection.js # Tester la connexion DB
```

### Tests

```bash
node scripts/test-api.js        # Test complet de l'API
node scripts/run-tests.js all   # Tous les tests
```

### Base de données

```bash
node db.js help                 # Aide
node db.js all                  # Configuration complète
```

## 📚 Documentation

- [Guide de l'API](docs/API_GUIDE.md)
- [Configuration Supabase](docs/SUPABASE_SETUP.md)
- [Base de données](src/database/README.md)

## 🌐 Environnements

- **Développement** : `npm run dev`
- **Test** : `NODE_ENV=test node dist/index.js --start-server`
- **Production** : `npm start`

## 🔐 Authentification

L'API utilise JWT pour l'authentification. Les routes protégées nécessitent un token valide dans l'en-tête `Authorization: Bearer <token>`.

## 📝 Logs

Les logs sont affichés dans la console avec des couleurs pour faciliter le débogage :

- 🟢 Succès
- 🔴 Erreur
- 🟡 Avertissement
- 🔵 Information
