#!/bin/bash

echo "🚀 Déploiement Nation Sounds - VPS"

# Étape 1 : Aller dans le dossier du projet
cd ~/Nation-Sounds-API || exit

echo "📥 Pull des dernières modifications depuis Git"
git pull origin main

# Étape 2 : Installer les dépendances
echo "📦 Installation des dépendances"
npm install

# Étape 3 : Build TypeScript
echo "🏗️ Compilation du projet TypeScript"
npm run build

# Étape 4 : Reconstruction et redémarrage des containers
echo "🐳 Redémarrage de Docker avec rebuild"
docker-compose up -d --build

# Étape 5 : Lancer les migrations dans le container API
echo "📦 Application des migrations"
docker exec -it nation-sounds-api-api-1 npm run migration:run

echo "✅ Déploiement terminé avec succès !"

