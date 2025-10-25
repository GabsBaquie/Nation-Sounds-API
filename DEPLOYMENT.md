# 🚀 Guide de Déploiement - Nation Sounds API

## 📋 Prérequis

- Docker & Docker Compose installés
- Compte Supabase configuré
- Clés d'API Supabase

## 🔧 Configuration

### 1. Variables d'environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env.docker
```

Éditez `.env.docker` avec vos clés Supabase :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
SUPABASE_ANON_KEY=votre_anon_key
DATABASE_URL=postgresql://postgres.votre_projet:votre_mot_de_passe@aws-1-eu-west-3.pooler.supabase.com:6543/postgres
JWT_SECRET=votre_jwt_secret_long_et_securise
```

### 2. Déploiement Docker

```bash
# Construction et démarrage
docker compose up -d --build

# Vérification des logs
docker logs -f nation-sounds-api

# Arrêt
docker compose down
```

## 🌐 Accès

- **API** : `http://localhost:3000`
- **Documentation** : Voir `docs/API_GUIDE.md`

## 🔍 Vérification

Testez l'API :

```bash
curl http://localhost:3000/api/concerts
```

## 📊 Monitoring

```bash
# Logs en temps réel
docker logs -f nation-sounds-api

# Statut des conteneurs
docker compose ps

# Redémarrage
docker compose restart
```

## 🛠️ Maintenance

### Mise à jour

```bash
git pull
docker compose down
docker compose up -d --build
```

### Sauvegarde base de données

Les données sont stockées sur Supabase (sauvegarde automatique).

### Logs

```bash
# Logs de l'API
docker logs nation-sounds-api

# Logs Docker Compose
docker compose logs
```

---

**Support** : Voir `docs/` pour plus d'informations
