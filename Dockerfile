# Utiliser Node.js 18 Alpine pour un build léger
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY config/ ./config/

# Installer toutes les dépendances (dev + prod pour la compilation)
RUN npm ci

# Copier le code source
COPY src/ ./src/
COPY database/ ./database/

# Compiler TypeScript
RUN npm run build

# Stage de production
FROM node:18-alpine AS production

# Installer les dépendances système nécessaires
RUN apk add --no-cache dumb-init

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production && npm cache clean --force

# Copier les fichiers compilés depuis le stage builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/database ./database

# Créer le dossier uploads
RUN mkdir -p uploads/images && chown -R nodejs:nodejs uploads

# Changer vers l'utilisateur non-root
USER nodejs

# Exposer le port
EXPOSE 8080

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=8080

# Utiliser dumb-init pour gérer les signaux
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage
CMD ["node", "dist/src/index.js"]
