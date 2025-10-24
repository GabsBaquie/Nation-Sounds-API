# 🧪 Guide de Test Postman - Nation Sounds API avec Supabase

## 🎯 **État : OPÉRATIONNEL** ✅

Votre API Nation Sounds est **parfaitement connectée à Supabase** et prête pour les tests !

### 📊 **Configuration actuelle :**

- **URL API :** `http://localhost:8081/api`
- **Base de données :** Supabase PostgreSQL ✅
- **Connexion :** Fonctionnelle ✅
- **Collection Postman :** Créée ✅

---

## 🚀 **Démarrage rapide**

### 1. **Import de la collection Postman**

```bash
# Fichier à importer :
/Users/gabriellebaquie/Dev/nation-sounds-api/Nation-Sounds-API.postman_collection.json
```

### 2. **Variables d'environnement configurées**

- `baseUrl` : `http://localhost:8081`
- `apiUrl` : `http://localhost:8081/api`
- `token` : (sera rempli automatiquement après login)

---

## 🧪 **Tests recommandés par ordre de priorité**

### **Phase 1 : Tests de base** 🔍

#### 1. **Test API Health**

- **Méthode :** `GET`
- **URL :** `{{apiUrl}}/`
- **Attendu :** `{"days":[],"concerts":[],"pois":[],"securityInfos":[]}`
- **Status :** ✅ Fonctionnel

#### 2. **Test Concerts**

- **Méthode :** `GET`
- **URL :** `{{apiUrl}}/concerts`
- **Attendu :** `[]` (vide pour l'instant)
- **Status :** ✅ Fonctionnel

#### 3. **Test Days**

- **Méthode :** `GET`
- **URL :** `{{apiUrl}}/days`
- **Attendu :** `[]` (vide pour l'instant)
- **Status :** ✅ Fonctionnel

#### 4. **Test POI**

- **Méthode :** `GET`
- **URL :** `{{apiUrl}}/pois`
- **Attendu :** `[]` (vide pour l'instant)
- **Status :** ✅ Fonctionnel

---

### **Phase 2 : Tests d'authentification** 🔐

#### 5. **Login (nécessite des credentials valides)**

- **Méthode :** `POST`
- **URL :** `{{apiUrl}}/auth/login`
- **Body :**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

- **Script de test :** Sauvegarde automatique du token
- **Status :** ⚠️ Nécessite des credentials valides

#### 6. **Get Profile (avec token)**

- **Méthode :** `GET`
- **URL :** `{{apiUrl}}/auth/profile`
- **Headers :** `Authorization: Bearer {{token}}`
- **Status :** ⚠️ Nécessite un token valide

---

### **Phase 3 : Tests CRUD (avec authentification)** 📝

#### 7. **Create Concert**

- **Méthode :** `POST`
- **URL :** `{{apiUrl}}/concerts`
- **Headers :** `Authorization: Bearer {{token}}`
- **Body :**

```json
{
  "title": "Concert Test Supabase",
  "description": "Test avec Supabase",
  "performer": "Artiste Test",
  "time": "20:00",
  "location": "Scène Supabase",
  "image": "test-supabase.jpg"
}
```

#### 8. **Create Day**

- **Méthode :** `POST`
- **URL :** `{{apiUrl}}/days`
- **Headers :** `Authorization: Bearer {{token}}`
- **Body :**

```json
{
  "title": "Jour Test Supabase",
  "date": "2024-07-01",
  "description": "Test jour avec Supabase"
}
```

#### 9. **Update Concert**

- **Méthode :** `PUT`
- **URL :** `{{apiUrl}}/concerts/1`
- **Headers :** `Authorization: Bearer {{token}}`
- **Body :**

```json
{
  "title": "Concert Test Modifié",
  "description": "Modifié avec Supabase",
  "performer": "Artiste Modifié",
  "time": "21:00",
  "location": "Scène Modifiée"
}
```

#### 10. **Delete Concert**

- **Méthode :** `DELETE`
- **URL :** `{{apiUrl}}/concerts/1`
- **Headers :** `Authorization: Bearer {{token}}`

---

### **Phase 4 : Tests avancés Supabase** 🚀

#### 11. **Search Concerts**

- **Méthode :** `GET`
- **URL :** `{{apiUrl}}/concerts/search?q=test`
- **Attendu :** Résultats de recherche

#### 12. **Get Days by Date Range**

- **Méthode :** `GET`
- **URL :** `{{apiUrl}}/days/date-range?start=2024-01-01&end=2024-12-31`
- **Attendu :** Jours dans la plage

#### 13. **Add Concerts to Day**

- **Méthode :** `PUT`
- **URL :** `{{apiUrl}}/days/1/concerts`
- **Body :**

```json
{
  "concertIds": [1, 2, 3]
}
```

---

## 📊 **Monitoring Supabase**

### **Logs de connexion attendus :**

```
✅ Connexion à la base de données réussie ! { now: 2025-10-22T20:13:50.894Z }
🚀 Serveur démarré sur http://0.0.0.0:8081
```

### **Requêtes SQL Supabase en cours :**

```sql
-- Vos requêtes actuelles qui fonctionnent :
SELECT d.*, COALESCE(JSON_AGG(...)) as concerts FROM day d...
SELECT c.*, COALESCE(JSON_AGG(...)) as days FROM concert c...
SELECT * FROM poi ORDER BY created_at DESC
SELECT * FROM security_info ORDER BY created_at DESC
```

---

## 🔧 **Dépannage**

### **Problèmes courants :**

1. **Erreur de connexion :**

   - Vérifiez que le serveur est démarré : `npm start`
   - Vérifiez le port : `http://localhost:8081`

2. **Erreur d'authentification :**

   - Vérifiez les credentials dans la base Supabase
   - Vérifiez que le token est bien sauvegardé

3. **Erreur CORS :**
   - L'API est configurée pour plusieurs origines
   - Vérifiez les headers dans Postman

### **Commandes utiles :**

```bash
# Démarrer l'API
cd /Users/gabriellebaquie/Dev/nation-sounds-api
npm start

# Tester la connexion
curl http://localhost:8081/api/

# Vérifier les processus
ps aux | grep "node dist/index.js"
```

---

## 🎉 **Résultats attendus**

### **✅ Tests réussis :**

- ✅ API Health : `{"days":[],"concerts":[],"pois":[],"securityInfos":[]}`
- ✅ Concerts : `[]`
- ✅ Days : `[]`
- ✅ POI : `[]`

### **⚠️ Tests nécessitant configuration :**

- 🔐 Authentification (credentials Supabase)
- 📝 CRUD operations (avec authentification)
- 🔍 Recherche avancée

---

## 📈 **Prochaines étapes**

1. **Configurez l'authentification** dans Supabase
2. **Ajoutez des données de test** via l'interface Supabase
3. **Testez les opérations CRUD** avec Postman
4. **Explorez les fonctionnalités avancées** Supabase

**🚀 Votre API Nation Sounds est maintenant une machine Supabase parfaitement huilée !**
