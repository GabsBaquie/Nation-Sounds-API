#!/bin/bash

echo "🚀 Démarrage de l'API Nation Sounds avec .env.test..."

# Compiler le projet
echo "📦 Compilation du projet..."
npm run build

# Démarrer le serveur avec .env.test
echo "🌐 Démarrage du serveur avec .env.test..."
NODE_ENV=test node dist/index.js &
SERVER_PID=$!

# Attendre que le serveur démarre
echo "⏳ Attente du démarrage du serveur..."
sleep 5

# Tester l'API
echo "🧪 Test de l'API..."
node test-api.js

# Arrêter le serveur
echo "🛑 Arrêt du serveur..."
kill $SERVER_PID

echo "✅ Test terminé !"
