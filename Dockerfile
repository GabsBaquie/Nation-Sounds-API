FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY config/ ./config/

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY src/ ./src/
COPY database/ ./database/

# Compiler TypeScript
RUN npm run build

# Créer le dossier uploads
RUN mkdir -p uploads/images

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/src/index.js"]
