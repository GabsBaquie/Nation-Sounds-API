# Guide de Test API avec Postman - Nation Sounds

## Configuration de Base
- URL de base (local) : `http://localhost:4000`
- Headers par défaut : 
  ```
  Content-Type: application/json
  ```

## Routes Programmes (Days)

### 1. Lister tous les programmes
- **Méthode** : GET
- **Route** : `/api/programs`
- **Body** : Aucun
- **Réponse attendue** :
  ```json
  [
    {
      "id": 1,
      "title": "Jour 1",
      "date": "2024-07-01",
      "concerts": [
        {
          "id": 1,
          "title": "Concert Rock",
          "description": "Description du concert",
          "performer": "Artiste Rock",
          "time": "20:00",
          "location": "Scène principale",
          "image": "url_image.jpg"
        }
      ],
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
  ```

### 2. Récupérer un programme spécifique
- **Méthode** : GET
- **Route** : `/api/programs/:id`
- **Exemple** : `/api/programs/1`
- **Body** : Aucun
- **Réponse attendue** :
  ```json
  {
    "id": 1,
    "title": "Jour 1",
    "date": "2024-07-01",
    "concerts": [],
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
  ```

### 3. Créer un nouveau programme
- **Méthode** : POST
- **Route** : `/api/programs`
- **Body** :
  ```json
  {
    "title": "Jour 1",
    "date": "2024-07-01",
    "concerts": [1, 2] // IDs des concerts (optionnel)
  }
  ```
- **Réponse attendue** :
  ```json
  {
    "id": 1,
    "title": "Jour 1",
    "date": "2024-07-01",
    "concerts": [
      {
        "id": 1,
        "title": "Concert Rock"
        // ... autres détails du concert
      }
    ],
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
  ```

### 4. Mettre à jour un programme
- **Méthode** : PUT
- **Route** : `/api/programs/:id`
- **Exemple** : `/api/programs/1`
- **Body** :
  ```json
  {
    "title": "Jour 1 - Modifié",
    "date": "2024-07-02",
    "concerts": [1, 3, 4] // Nouveaux IDs de concerts
  }
  ```
- **Réponse attendue** :
  ```json
  {
    "id": 1,
    "title": "Jour 1 - Modifié",
    "date": "2024-07-02",
    "concerts": [
      {
        "id": 1,
        "title": "Concert Rock"
        // ... autres détails du concert
      }
      // ... autres concerts
    ],
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
  ```

### 5. Supprimer un programme
- **Méthode** : DELETE
- **Route** : `/api/programs/:id`
- **Exemple** : `/api/programs/1`
- **Body** : Aucun
- **Réponse attendue** :
  ```json
  {
    "message": "Programme supprimé avec succès"
  }
  ```

## Codes d'Erreur Possibles

### Erreurs Client (4xx)
- **400** : Données invalides dans la requête
  ```json
  {
    "message": "Erreur de validation"
  }
  ```
- **404** : Programme non trouvé
  ```json
  {
    "message": "Programme non trouvé"
  }
  ```

### Erreurs Serveur (5xx)
- **500** : Erreur serveur
  ```json
  {
    "message": "Erreur serveur"
  }
  ```

## Conseils pour les Tests
1. Créez d'abord quelques concerts avant de les associer aux programmes
2. Testez la création d'un programme sans concerts d'abord
3. Puis testez l'ajout de concerts à un programme existant
4. Vérifiez que la suppression d'un programme ne supprime pas les concerts associés
5. Testez la mise à jour partielle (seulement certains champs) pour vérifier que les champs non fournis ne sont pas modifiés

## Collection Postman
Pour faciliter les tests, vous pouvez créer une collection Postman avec :
1. Une variable d'environnement pour l'URL de base
2. Des tests pour vérifier les codes de statut
3. Des scripts pour extraire et réutiliser les IDs créés

## Variables d'Environnement Suggérées
- `baseUrl` : URL de base de l'API
- `programId` : ID du dernier programme créé
- `concertId` : ID du dernier concert créé 