# 🔧 Configuration Supabase pour les tests

## 📋 Informations nécessaires

Pour configurer votre API avec Supabase, vous avez besoin de :

### 1. URL de connexion à la base de données

- Allez dans votre projet Supabase
- Cliquez sur **Settings** → **Database**
- Copiez l'**URI** de connexion
- Format : `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

### 2. Mot de passe de la base de données

- Le mot de passe que vous avez défini lors de la création du projet
- Ou changez-le dans **Settings** → **Database** → **Database password**

### 3. Secret JWT

- Allez dans **Settings** → **API**
- Copiez le **JWT Secret**

## 🚀 Configuration rapide

### Option 1 : Script interactif

```bash
node setup-env.js
```

### Option 2 : Configuration manuelle

Éditez le fichier `.env.test` avec vos informations :

```env
# Configuration de test pour Supabase
NODE_ENV=test

# Base de données Supabase
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.VOTRE_PROJECT_REF.supabase.co:5432/postgres

# JWT Secret pour les tests
JWT_SECRET=VOTRE_JWT_SECRET

# Frontend URL pour les tests
FRONTEND_URL=http://localhost:3000
```

## 🧪 Test de la configuration

Une fois configuré :

```bash
# 1. Initialiser la base de données
node init-test-db.js

# 2. Compiler le projet
npm run build

# 3. Démarrer l'API avec .env.test
NODE_ENV=test node dist/index.js

# 4. Tester l'API (dans un autre terminal)
node test-api.js
```

## 🔍 Vérification

Si tout fonctionne, vous devriez voir :

- ✅ Base de données initialisée avec succès
- ✅ API accessible
- ✅ Connexion réussie
- ✅ Endpoints protégés fonctionnels

## 🛠️ Dépannage

### Erreur d'authentification

- Vérifiez le mot de passe dans l'URL de connexion
- Vérifiez que l'URL est correcte

### Erreur de connexion

- Vérifiez que votre projet Supabase est actif
- Vérifiez que l'URL de connexion est complète

### Erreur de permissions

- Vérifiez que l'utilisateur `postgres` a les bonnes permissions
- Vérifiez que la base de données `postgres` existe
