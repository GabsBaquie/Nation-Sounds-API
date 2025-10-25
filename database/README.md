# 🗄️ Base de données - Nation Sounds API

## 📁 Structure organisée

```
database/
├── 📁 migrations/           # Migrations SQL
│   └── init-schema.sql     # Script d'initialisation
├── 📁 views/               # Vues SQL
│   ├── overview.sql        # Vues principales
│   ├── analytics.sql       # Vues d'analyse
│   └── create-view.sql     # Vues de création
└── 📁 scripts/             # Scripts de gestion
    ├── connection.ts       # Connexion TypeScript
    ├── manager.ts          # Gestionnaire TypeScript
    ├── init-database.js    # Initialisation DB
    ├── create-all-views.js # Création des vues
    ├── db-manager.js       # Gestionnaire JS
    └── fix-admin-password.js # Correction mot de passe
```

## 🎯 **Pourquoi cette organisation ?**

### ✅ **Avant (confus) :**

- `src/database/` - Code TypeScript + vues SQL
- `scripts/database/` - Scripts JavaScript
- `database/` - Migrations SQL
- **3 dossiers différents = confusion !**

### ✅ **Maintenant (clair) :**

- `database/` - **UN SEUL endroit pour tout**
- `database/migrations/` - Migrations SQL
- `database/views/` - Vues SQL
- `database/scripts/` - Scripts de gestion

## 🚀 **Commandes disponibles**

```bash
# Gestion de la base de données
node db.js init          # Initialiser la DB
node db.js views         # Créer les vues
node db.js test          # Tester les vues
node db.js fix-admin     # Corriger le mot de passe admin
node db.js all           # Tout faire
```

## 📋 **Fichiers et leurs rôles**

### Migrations

- `init-schema.sql` - Création des tables et structure

### Vues SQL

- `overview.sql` - Vues principales (full_db, public_data, db_stats)
- `analytics.sql` - Vues d'analyse (poi_stats_by_type, concerts_by_month)
- `create-view.sql` - Vues de création

### Scripts de gestion

- `connection.ts` - Connexion TypeScript à PostgreSQL
- `manager.ts` - Gestionnaire TypeScript pour les vues
- `init-database.js` - Script d'initialisation
- `create-all-views.js` - Création de toutes les vues
- `db-manager.js` - Gestionnaire JavaScript
- `fix-admin-password.js` - Correction du mot de passe admin

## 🔧 **Utilisation dans le code**

```typescript
// Import de la connexion
import { query } from "../../database/scripts/connection";

// Import du gestionnaire
import { DatabaseManager } from "../../database/scripts/manager";
```

## 📊 **Vues disponibles**

- `full_db` - Toutes les données
- `public_data` - Données publiques
- `db_stats` - Statistiques par table
- `poi_stats_by_type` - Statistiques POIs
- `concerts_by_month` - Concerts par mois
- `recent_activity` - Activité récente

## 🎉 **Avantages de cette organisation**

1. **Un seul endroit** pour tout ce qui concerne la DB
2. **Séparation claire** : migrations, vues, scripts
3. **Plus de confusion** entre les dossiers
4. **Maintenance facile** et logique
5. **Évolutif** pour ajouter de nouveaux éléments
