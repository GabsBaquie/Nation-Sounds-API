# 🎵 Nation Sounds API

API REST pour la gestion du festival Nation Sounds - Backend Node.js/TypeScript avec Supabase.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- Docker & Docker Compose
- Compte Supabase

### Installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd nation-sounds-api
```

2. **Configuration**

```bash
cp .env.example .env.docker
# Éditer .env.docker avec vos clés Supabase
```

3. **Démarrage avec Docker**

```bash
docker compose up -d --build
```

L'API sera disponible sur `http://localhost:3000`

## 📁 Structure du Projet

```
src/
├── controllers/     # Contrôleurs API
├── services/       # Logique métier
├── middleware/     # Middlewares Express
├── routes/         # Définition des routes
├── dto/           # Data Transfer Objects
└── utils/         # Utilitaires

tests/             # Tests unitaires
docs/              # Documentation
database/          # Scripts et migrations DB
```

## 🔧 Scripts Disponibles

- `npm run build` - Compilation TypeScript
- `npm test` - Exécution des tests
- `npm run dev` - Développement local

## 📚 Documentation

- [Guide API](docs/API_GUIDE.md)
- [Intégration Supabase](docs/SUPABASE_INTEGRATION.md)
- [Guides de test](docs/guides/)

## 🛠️ Technologies

- **Backend**: Node.js, Express, TypeScript
- **Base de données**: PostgreSQL (Supabase)
- **Stockage**: Supabase Storage
- **Tests**: Jest, Supertest
- **Déploiement**: Docker

## 📝 Endpoints Principaux

- `GET /api/concerts` - Liste des concerts
- `GET /api/days` - Programmation par jour
- `GET /api/pois` - Points d'intérêt
- `POST /api/auth/login` - Authentification
- `POST /api/upload/image` - Upload d'images

## 🔒 Sécurité

- Authentification JWT
- Middleware de validation
- Upload sécurisé d'images
- Politiques RLS Supabase

---

**Développé pour le festival Nation Sounds** 🎷
