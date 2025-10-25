# 🎵 Nation Sounds API - Guide d'utilisation

## 🚀 Démarrage rapide

### 1. Installation et configuration

```bash
# Installer les dépendances
npm install

# Initialiser la base de données
node init-test-db.js

# Compiler le projet
npm run build

# Démarrer l'API
npm start
```

### 2. Test de l'API

```bash
# Tester l'API (serveur doit être démarré)
node test-api.js

# Ou utiliser le script complet
./start-and-test.sh

# Voir l'aide
node test-api.js --help
```

## 📋 Endpoints disponibles

### 🔐 Authentification

- `POST /api/auth/login` - Se connecter
- `GET /api/auth/profile` - Profil utilisateur (auth requise)
- `PUT /api/auth/change-password` - Changer le mot de passe (auth requise)
- `POST /api/auth/request-password-reset` - Demander une réinitialisation
- `POST /api/auth/reset-password` - Réinitialiser le mot de passe

### 👥 Administration

- `GET /api/admin/users` - Liste des utilisateurs (admin)
- `POST /api/admin/users` - Créer un utilisateur (admin)
- `GET /api/admin/users/:id` - Utilisateur par ID (admin)
- `PUT /api/admin/users/:id` - Modifier un utilisateur (admin)
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur (admin)

### 🎵 Concerts

- `GET /api/concerts` - Liste des concerts
- `GET /api/concerts/:id` - Concert par ID
- `POST /api/concerts` - Créer un concert (auth requise)
- `PUT /api/concerts/:id` - Modifier un concert (auth requise)
- `DELETE /api/concerts/:id` - Supprimer un concert (auth requise)
- `GET /api/concerts/search?q=terme` - Rechercher des concerts

### 📅 Jours

- `GET /api/days` - Liste des jours
- `GET /api/days/:id` - Jour par ID
- `POST /api/days` - Créer un jour (auth requise)
- `PUT /api/days/:id` - Modifier un jour (auth requise)
- `DELETE /api/days/:id` - Supprimer un jour (auth requise)
- `PUT /api/days/:id/concerts` - Associer des concerts à un jour (auth requise)
- `GET /api/days/date-range?start=YYYY-MM-DD&end=YYYY-MM-DD` - Jours par plage de dates

### 📍 Points d'intérêt (POI)

- `GET /api/pois` - Liste des POIs
- `GET /api/pois?type=restaurant` - POIs par type
- `GET /api/pois/:id` - POI par ID
- `POST /api/pois` - Créer un POI
- `PUT /api/pois/:id` - Modifier un POI
- `DELETE /api/pois/:id` - Supprimer un POI

### 🚨 Informations de sécurité

- `GET /api/securityInfos` - Liste des informations de sécurité
- `GET /api/securityInfos/:id` - Information par ID
- `POST /api/securityInfos` - Créer une information (auth requise)
- `PUT /api/securityInfos/:id` - Modifier une information (auth requise)
- `DELETE /api/securityInfos/:id` - Supprimer une information (auth requise)

## 🔑 Authentification

### Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Utilisation du token

```bash
curl -X GET http://localhost:3000/api/concerts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Exemples d'utilisation

### Créer un concert

```bash
curl -X POST http://localhost:3000/api/concerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Concert de rock",
    "description": "Un super concert de rock",
    "performer": "Groupe XYZ",
    "time": "20:00",
    "location": "Salle de concert",
    "image": "concert.jpg"
  }'
```

### Créer un jour

```bash
curl -X POST http://localhost:3000/api/days \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Jour 1",
    "date": "2024-12-31"
  }'
```

### Créer un POI

```bash
curl -X POST http://localhost:3000/api/pois \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Restaurant Le Bistrot",
    "type": "restaurant",
    "latitude": 45.5017,
    "longitude": -73.5673,
    "description": "Un excellent restaurant",
    "category": "gastronomie",
    "address": "123 Rue de la Paix"
  }'
```

## 🧪 Tests

### Tests unitaires

```bash
npm test
```

### Tests d'intégration

```bash
# Démarrer l'API
npm start

# Dans un autre terminal
node test-api.js
```

## 🛠️ Développement

### Mode développement

```bash
npm run dev
```

### Compilation

```bash
npm run build
```

### Variables d'environnement

- `DATABASE_URL` - URL de connexion à la base de données
- `JWT_SECRET` - Secret pour les tokens JWT
- `FRONTEND_URL` - URL du frontend
- `NODE_ENV` - Environnement (development, production, test)

## 📊 Structure de la base de données

- `user` - Utilisateurs
- `concert` - Concerts
- `day` - Jours
- `poi` - Points d'intérêt
- `security_info` - Informations de sécurité
- `concert_days_day` - Table de liaison concerts-jours

## 🔧 Dépannage

### L'API ne démarre pas

1. Vérifiez que la base de données est accessible
2. Vérifiez les variables d'environnement
3. Exécutez `node init-test-db.js` pour initialiser la base

### Erreurs 401 (Non autorisé)

1. Vérifiez que vous êtes connecté
2. Vérifiez que le token est valide
3. Vérifiez que vous avez les bonnes permissions

### Erreurs 500 (Erreur serveur)

1. Vérifiez les logs du serveur
2. Vérifiez la connexion à la base de données
3. Vérifiez la structure des données envoyées
