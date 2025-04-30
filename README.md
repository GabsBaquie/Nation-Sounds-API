# Nation Sounds API

Backend robust pour l'application Nation Sounds, offrant une API RESTful en TypeScript et Express pour gérer utilisateurs, jours, concerts, points d'intérêt et informations de sécurité.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Base de données](#base-de-données)
- [Tests](#tests)
- [Architecture du projet](#architecture-du-projet)
- [Endpoints principaux](#endpoints-principaux)
- [Déploiement](#déploiement)
- [Contribution](#contribution)
- [Licence](#licence)

## Fonctionnalités

- Authentification JWT (inscription, connexion, rafraîchissement de token)
- Gestion des utilisateurs (CRUD avec rôles `admin` et `user`)
- Gestion des journées (`Day`) et des concerts (`Concert`), relation Many-to-Many
- Gestion des Points d'Intérêt (`POI`)
- Gestion des informations de sécurité (`SecurityInfo`)
- Endpoint global pour récupérer l'ensemble des données de l'application

## Technologies

- Node.js (≥18)
- TypeScript
- Express.js
- TypeORM (MySQL / MariaDB via JawsDB)
- class-validator, bcrypt, jsonwebtoken, helmet, cors

## Prérequis

- [Node.js](https://nodejs.org/) ≥18 et npm
- Base de données MySQL / MariaDB (ex. JawsDB ou service local)
- Compte [Heroku](https://heroku.com) pour le déploiement
- Fichier `.env` à la racine du projet

## Installation

```bash
# Cloner le repo
git clone https://github.com/GabsBaquie/Nation-Sounds-API.git
cd nation-sounds-api

# Installer les dépendances
npm install
```

## Configuration

Créer un fichier `.env` à la racine et définir les variables suivantes :

```dotenv
# URL de connexion MySQL / MariaDB (production)
JAWSDB_MARIA_URL=mysql://<user>:<pass>@<host>:<port>/<database>

# URL de connexion MySQL / MariaDB (tests)
TEST_JAWSDB_MARIA_URL=mysql://<user>:<pass>@<host>:<port>/<test_database>

# Port d'écoute du serveur (facultatif)
PORT=4000

# Secret pour les tokens JWT
JWT_SECRET=une_phrase_secrete

# Environnement (development | test | production)
NODE_ENV=development
```

## Démarrage

### Mode développement

```bash
npm run dev
```
Le serveur démarre en `http://localhost:4000/api` avec rechargement à chaud en TypeScript.

### Build et production

```bash
npm run build
npm start
```

## Base de données

L'application utilise JawsDB Maria (MySQL) via TypeORM :

- **Production** : Base de données principale
  - `synchronize: false` (pas de modifications automatiques)
  - `dropSchema: false` (protection des données)
  - Migrations requises pour les changements de schéma

- **Tests** : Base de données de test
  - `synchronize: true` (création automatique des tables)
  - `dropSchema: true` (réinitialisation à chaque test)
  - Pas besoin de migrations

### Migrations

```bash
# Générer une migration
npm run migration:generate -- -n NomMigration

# Appliquer les migrations
npm run migration:run
```

## Tests

Les tests utilisent une base JawsDB dédiée :

```bash
# Exécuter tous les tests
npm test

# Tests avec couverture
npm test -- --coverage
```

## Architecture du projet

```bash
src/
├── controllers/        # Logique métier et gestion des requêtes
├── entity/            # Entités TypeORM (User, Day, Concert, POI, SecurityInfo)
├── middleware/        # Middlewares (authentification, rôles, erreurs)
├── routes/           # Définition des routes Express
├── migration/        # Fichiers de migration TypeORM
├── utils/           # Fonctions utilitaires (seed, helpers)
├── data-source.ts   # Configuration TypeORM
└── index.ts         # Point d'entrée de l'application
```

## Endpoints principaux

- **Auth**
  - `POST /api/auth/register` : Inscription
  - `POST /api/auth/login`    : Connexion

- **Users (admin)**
  - `GET /api/admin/users`     : Liste des utilisateurs
  - `PUT /api/admin/users/:id` : Mise à jour d'un utilisateur
  - `DELETE /api/admin/users/:id` : Suppression d'un utilisateur

- **Programme & données**
  - `GET /api/`              : Récupération globale (jours, concerts, POIs, securityInfos)
  - `GET /api/days`          : Liste des journées
  - `GET /api/concerts`      : Liste des concerts
  - `GET /api/pois`         : Liste des points d'intérêt
  - `GET /api/securityInfos` : Liste des informations de sécurité

## Déploiement

L'application est déployée sur Heroku :

```bash
# Premier déploiement
heroku create nation-sounds-api
heroku addons:create jawsdb-maria:kitefin
git push heroku main

# Déploiements suivants
git push heroku main
```

Variables d'environnement Heroku requises :
- `JAWSDB_MARIA_URL` (ajouté automatiquement par l'addon)
- `TEST_JAWSDB_MARIA_URL` (pour les tests CI)
- `JWT_SECRET`
- `NODE_ENV=production`

## Contribution

Les contributions sont les bienvenues ! Merci de :

1. Forker le dépôt
2. Créer une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Committer vos modifications (`git commit -m "Ajout d'une fonctionnalité"`)
4. Pusher sur votre branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.