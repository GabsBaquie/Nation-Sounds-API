# 🔒 Guide de Sécurité Docker

## Configuration sécurisée

Le docker-compose utilise maintenant des variables d'environnement pour sécuriser les secrets.

### 1. Configuration des variables

Copiez le fichier d'exemple et configurez vos vraies valeurs :

```bash
cp docker.env.example .env.docker
```

### 2. Variables requises

Dans `.env.docker`, configurez :

```bash
# Configuration Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
SUPABASE_ANON_KEY=votre-anon-key

# Base de données
DATABASE_URL=postgresql://postgres.votre-projet:votre-mot-de-passe@aws-1-eu-west-3.pooler.supabase.com:5432/postgres

# JWT Secret (générez une clé sécurisée)
JWT_SECRET=votre-jwt-secret-super-securise
```

### 3. Sécurité

- ✅ **Secrets dans .env.docker** (pas dans docker-compose.yml)
- ✅ **Fichier .env.docker dans .gitignore**
- ✅ **Variables d'environnement Docker**
- ✅ **Fichier d'exemple sans secrets**

### 4. Déploiement

```bash
# Démarrer avec les variables sécurisées
docker-compose up -d
```

### 5. Vérification

```bash
# Vérifier que l'API fonctionne
curl http://localhost/api/
```

## 🛡️ Bonnes pratiques

1. **Ne jamais commiter** `.env.docker` dans Git
2. **Utiliser des secrets forts** pour JWT_SECRET
3. **Régénérer les clés** Supabase régulièrement
4. **Utiliser HTTPS** en production
5. **Limiter l'accès** aux fichiers de configuration
