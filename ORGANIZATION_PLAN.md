# 📁 Plan d'organisation optimale - Nation Sounds API

## 🎯 Objectifs

- Éliminer les doublons
- Clarifier les responsabilités
- Améliorer la maintenabilité
- Standardiser les noms

## 📋 Structure proposée

```
nation-sounds-api/
├── 📁 src/                          # Code source TypeScript
│   ├── 📁 controllers/              # Contrôleurs API
│   │   ├── AdminController.ts
│   │   ├── AuthController.ts
│   │   ├── ConcertController.ts
│   │   ├── DayController.ts
│   │   ├── PoiController.ts
│   │   ├── SecurityInfoController.ts
│   │   ├── StatsController.ts
│   │   └── 📁 __tests__/            # Tests unitaires
│   │       ├── AdminController.test.ts
│   │       ├── AuthController.test.ts
│   │       ├── ConcertController.test.ts
│   │       ├── DayController.test.ts
│   │       ├── PoiController.test.ts
│   │       └── SecurityInfoController.test.ts
│   ├── 📁 database/                 # Gestion de la base de données
│   │   ├── connection.ts            # Connexion DB
│   │   ├── manager.ts               # Gestionnaire TypeScript
│   │   └── README.md                # Documentation DB
│   ├── 📁 dto/                      # Data Transfer Objects
│   │   ├── create-concert.dto.ts
│   │   ├── create-day.dto.ts
│   │   ├── create-poi.dto.ts
│   │   └── create-security-info.dto.ts
│   ├── 📁 middleware/               # Middlewares Express
│   │   ├── adminMiddleware.ts
│   │   ├── authMiddleware.ts
│   │   ├── checkJwt.ts
│   │   ├── roleMiddleware.ts
│   │   ├── uploadImage.ts
│   │   ├── validateDto.ts
│   │   ├── index.ts
│   │   └── 📁 __tests__/            # Tests middleware
│   │       └── authMiddleware.test.ts
│   ├── 📁 routes/                   # Routes API
│   │   ├── adminRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── concertRoutes.ts
│   │   ├── dayRoutes.ts
│   │   ├── poiRoutes.ts
│   │   ├── securityInfoRoutes.ts
│   │   ├── statsRoutes.ts
│   │   ├── uploadRoutes.ts
│   │   └── index.ts
│   ├── 📁 services/                 # Services métier
│   │   ├── ConcertService.ts
│   │   ├── DayService.ts
│   │   ├── PoiService.ts
│   │   ├── SecurityInfoService.ts
│   │   └── UserService.ts
│   ├── 📁 types/                    # Types TypeScript
│   │   ├── database.ts
│   │   └── express.d.ts
│   ├── 📁 utils/                    # Utilitaires
│   │   ├── emailService.ts
│   │   └── testSetup.ts
│   └── index.ts                     # Point d'entrée
├── 📁 database/                     # Scripts et vues SQL
│   ├── 📁 migrations/               # Migrations SQL
│   │   └── init-schema.sql
│   ├── 📁 views/                    # Vues SQL
│   │   ├── overview.sql
│   │   └── analytics.sql
│   └── README.md                    # Documentation DB
├── 📁 scripts/                      # Scripts utilitaires
│   ├── 📁 database/                 # Scripts de gestion DB
│   │   ├── create-views.js
│   │   ├── fix-admin-password.js
│   │   └── init-database.js
│   ├── 📁 testing/                  # Scripts de test
│   │   ├── test-api.js
│   │   ├── test-connection.js
│   │   └── start-test-api.js
│   ├── run-tests.js                 # Gestionnaire de tests
│   └── setup-env.js                 # Configuration environnement
├── 📁 tests/                        # Tests d'intégration
│   └── start-and-test.sh
├── 📁 docs/                         # Documentation
│   ├── API_GUIDE.md
│   ├── SUPABASE_SETUP.md
│   ├── DOCKER_DB_UTILS.md
│   └── POSTMAN_TESTS.md
├── 📁 config/                       # Configuration
│   ├── tsconfig.json
│   └── jest.config.js
├── 📁 uploads/                      # Fichiers uploadés
│   └── images/
├── db.js                            # Point d'entrée DB (redirection)
├── package.json
├── package-lock.json
├── README.md
└── .env.example
```

## 🔄 Actions de réorganisation

### 1. Nettoyer les doublons

- Supprimer `src/database/scripts/` (garder `scripts/database/`)
- Supprimer `src/scripts/` (déplacer vers `database/migrations/`)

### 2. Renommer les fichiers

- `create-view.sql` → `overview.sql` (déjà fait)
- `db-manager.ts` → `manager.ts`
- `init-test-db.js` → `init-database.js`

### 3. Réorganiser les scripts

- Déplacer scripts DB vers `scripts/database/`
- Déplacer scripts de test vers `scripts/testing/`

### 4. Créer des dossiers manquants

- `database/migrations/`
- `scripts/database/`
- `scripts/testing/`
- `config/`

## 📝 Avantages de cette organisation

1. **Séparation claire** : Chaque type de fichier a sa place
2. **Élimination des doublons** : Plus de confusion
3. **Noms cohérents** : Convention de nommage uniforme
4. **Maintenabilité** : Structure logique et prévisible
5. **Scalabilité** : Facile d'ajouter de nouveaux éléments

## 🚀 Commandes de migration

```bash
# 1. Créer la nouvelle structure
mkdir -p database/migrations scripts/database scripts/testing config

# 2. Déplacer les fichiers
mv src/scripts/init-db.sql database/migrations/init-schema.sql
mv src/database/scripts/* scripts/database/
mv scripts/test-*.js scripts/testing/
mv scripts/setup-env.js scripts/
mv tsconfig.json config/

# 3. Renommer les fichiers
mv src/database/db-manager.ts src/database/manager.ts
mv scripts/database/init-test-db.js scripts/database/init-database.js

# 4. Nettoyer
rm -rf src/database/scripts src/scripts
```

## ✅ Résultat final

Une structure claire, cohérente et maintenable qui respecte les bonnes pratiques de développement Node.js/TypeScript.
