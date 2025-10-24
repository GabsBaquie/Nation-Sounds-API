# 🐳 Docker - Nation Sounds API avec Supabase

## Configuration requise

Avant de démarrer, configurez vos clés Supabase dans le fichier `.env.docker` :

```bash
# Éditer le fichier .env.docker
nano .env.docker

# Remplacer les valeurs :
SUPABASE_SERVICE_ROLE_KEY=votre-vraie-cle-service-role
SUPABASE_ANON_KEY=votre-vraie-cle-anon
JWT_SECRET=votre-secret-jwt-securise
```

## Démarrage rapide

```bash
# 1. Démarrer l'API
docker-compose up -d

# 2. Vérifier que tout fonctionne
curl http://localhost/

# 3. Arrêter
docker-compose down
```

## Configuration

- **API** : http://localhost (port 80)
- **Base de données** : Supabase (cloud)
- **Uploads** : `./uploads/` (monté en volume)

## Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer l'API
docker-compose restart api

# Se connecter au conteneur
docker-compose exec api sh
```
