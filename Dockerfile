FROM node:18

WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Compilation TypeScript → JavaScript
RUN npm run build

# Lancement de l'app en production
CMD ["npm", "run", "start:prod"]