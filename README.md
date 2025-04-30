# Nation Sounds API

Backend robust pour l'application Nation Sounds, offrant une API RESTful en TypeScript et Express pour gérer utilisateurs, jours, concerts, points d'intérêt et informations de sécurité.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Base de données et migrations](#base-de-données-et-migrations)
- [Seed](#seed)
- [Tests](#tests)
- [Architecture du projet](#architecture-du-projet)
- [Endpoints principaux](#endpoints-principaux)
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

- Node.js (v18+)
- TypeScript
- Express.js
- TypeORM (MySQL / MariaDB)
- class-validator, bcrypt, jsonwebtoken, helmet, cors

## Prérequis

- [Node.js](https://nodejs.org/) et npm ou yarn
- Base de données MySQL / MariaDB (ex. JawsDB ou service local)
- Fichier `.env` à la racine du projet

## Installation

```bash
git clone <URL_DU_REPO>
cd nation-sounds-api
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

## Base de données et migrations

TypeORM gère les migrations via la CLI :

- Générer une migration :
  ```bash
  npm run migration:generate -- -n NomMigration
  ```

- Appliquer les migrations :
  ```bash
  npm run migration:run
  ```

## Seed

Pour peupler la base initialement :

```bash
npm run seed
```

## Tests

Les tests unitaires et d'intégration sont écrits avec Jest et Supertest :

```bash
npm test
```

## Architecture du projet

```bash
src/
├── controllers/        # Logique métier et gestion des requêtes
├── entity/             # Entités TypeORM (User, Day, Concert, POI, SecurityInfo)
├── middleware/         # Middlewares (authentification, rôles, erreurs)
├── routes/             # Définition des routes Express
├── migration/          # Fichiers de migration TypeORM
├── utils/              # Fonctions utilitaires (seed, helpers)
├── data-source.ts      # Configuration TypeORM
└── index.ts            # Point d'entrée de l'application
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
  - `GET /api/`                        : Récupération globale (jours, concerts, POIs, securityInfos)
  - `GET /api/days`                   : Liste des journées
  - `GET /api/concerts`               : Liste des concerts
  - `GET /api/pois`                   : Liste des points d'intérêt
  - `GET /api/securityInfos`          : Liste des informations de sécurité

> Pour la liste complète des endpoints (CRUD, paramètres et exemples de requêtes), consulter les fichiers de routes dans `src/routes/`.