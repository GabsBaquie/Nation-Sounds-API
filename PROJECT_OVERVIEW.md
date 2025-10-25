# 🎵 Nation Sounds API - Présentation Projet

## 📖 Vue d'ensemble

**Nation Sounds API** est une API REST complète développée pour la gestion du festival de jazz Nation Sounds. Elle permet la gestion des concerts, de la programmation, des points d'intérêt et des actualités du festival.

## 🎯 Objectifs du Projet

- **Gestion centralisée** des données du festival
- **API REST** pour les applications frontend
- **Stockage sécurisé** des images via Supabase
- **Authentification** et autorisation des utilisateurs
- **Interface d'administration** pour la gestion du contenu

## 🏗️ Architecture Technique

### Stack Technologique

- **Backend** : Node.js + Express + TypeScript
- **Base de données** : PostgreSQL (Supabase)
- **Stockage** : Supabase Storage
- **Authentification** : JWT + Supabase Auth
- **Tests** : Jest + Supertest
- **Déploiement** : Docker + Docker Compose

### Structure du Code

```
src/
├── controllers/     # Logique des endpoints API
├── services/       # Logique métier et accès aux données
├── middleware/     # Authentification, validation, upload
├── routes/         # Définition des routes Express
├── dto/           # Types TypeScript pour les données
└── utils/         # Utilitaires (email, tests)
```

## 🚀 Fonctionnalités Principales

### 1. **Gestion des Concerts**

- CRUD complet des concerts
- Recherche et filtrage
- Association avec les jours du festival
- Upload d'images pour les artistes

### 2. **Programmation**

- Gestion des jours du festival
- Association concerts ↔ jours
- Affichage chronologique

### 3. **Points d'Intérêt (POI)**

- Cartographie interactive
- Catégorisation (scènes, bars, toilettes, etc.)
- Géolocalisation précise

### 4. **Actualités & Alertes**

- Gestion des actualités du festival
- Système d'alertes d'urgence
- Priorisation des informations

### 5. **Authentification & Sécurité**

- JWT pour l'authentification
- Rôles utilisateurs (admin/user)
- Upload sécurisé d'images
- Validation des données

## 📊 Endpoints API

### Concerts

- `GET /api/concerts` - Liste des concerts
- `GET /api/concerts/search?q=terme` - Recherche
- `POST /api/concerts` - Créer un concert
- `PUT /api/concerts/:id` - Modifier
- `DELETE /api/concerts/:id` - Supprimer

### Programmation

- `GET /api/days` - Jours du festival
- `GET /api/days/:id/concerts` - Concerts d'un jour

### Points d'Intérêt

- `GET /api/pois` - Tous les POI
- `GET /api/pois?category=stage` - POI par catégorie

### Authentification

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/forgot-password` - Mot de passe oublié

## 🔒 Sécurité

- **Authentification JWT** avec expiration
- **Validation stricte** des données d'entrée
- **Upload sécurisé** avec vérification des types
- **Politiques RLS** Supabase pour la base de données
- **CORS** configuré pour les domaines autorisés

## 🧪 Tests

- **Tests unitaires** pour tous les contrôleurs
- **Tests d'intégration** pour les routes API
- **Tests de middleware** d'authentification
- **Couverture** des cas d'erreur et de succès

## 📈 Performance

- **Pool de connexions** PostgreSQL optimisé
- **Cache** des requêtes fréquentes
- **Compression** des réponses
- **Images optimisées** via Supabase Storage

## 🚀 Déploiement

- **Docker** pour la containerisation
- **Docker Compose** pour l'orchestration
- **Variables d'environnement** sécurisées
- **Logs structurés** pour le monitoring

## 📚 Documentation

- **Guide API** complet avec exemples
- **Collection Postman** pour les tests
- **Documentation de déploiement**
- **Guides de sécurité**

## 🎯 Points Forts

1. **Architecture modulaire** et maintenable
2. **TypeScript** pour la robustesse du code
3. **Tests complets** pour la fiabilité
4. **Sécurité** à tous les niveaux
5. **Documentation** exhaustive
6. **Déploiement** automatisé avec Docker

## 🔮 Évolutions Possibles

- **Cache Redis** pour les performances
- **WebSockets** pour les mises à jour temps réel
- **API GraphQL** pour des requêtes plus flexibles
- **Monitoring** avec Prometheus/Grafana
- **CI/CD** avec GitHub Actions

---

**Développé avec ❤️ pour le festival Nation Sounds** 🎷
