const axios = require("axios");
require("dotenv").config({ path: ".env.test" });

// Configuration de l'API
const API_BASE_URL = "http://0.0.0.0:8081/api";

// Fonction pour tester l'API
async function testAPI() {
  try {
    console.log("🚀 Test de l'API Nation Sounds...\n");

    // 1. Test de connexion
    console.log("1. Test de connexion...");
    try {
      const response = await axios.get(`${API_BASE_URL}/securityInfos`);
      console.log("✅ API accessible");
    } catch (error) {
      console.log("❌ API non accessible:", error.message);
      return;
    }

    // 2. Test de création d'utilisateur admin
    console.log("\n2. Création d'un utilisateur admin...");
    try {
      const adminData = {
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      };

      const response = await axios.post(
        `${API_BASE_URL}/admin/users`,
        adminData
      );
      console.log("✅ Utilisateur admin créé");
    } catch (error) {
      console.log(
        "⚠️  Utilisateur admin existe déjà ou erreur:",
        error.response?.data?.message || error.message
      );
    }

    // 3. Test de connexion
    console.log("\n3. Test de connexion...");
    try {
      const loginData = {
        email: "admin@example.com",
        password: "admin123",
      };

      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        loginData
      );
      const token = response.data.token;
      console.log("✅ Connexion réussie");
      console.log("Token:", token.substring(0, 20) + "...");

      // 4. Test des endpoints protégés
      console.log("\n4. Test des endpoints protégés...");

      // Test création d'information de sécurité
      const securityData = {
        title: "Test Sécurité",
        description: "Description de test",
        urgence: false,
        actif: true,
      };

      const securityResponse = await axios.post(
        `${API_BASE_URL}/securityInfos`,
        securityData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("✅ Information de sécurité créée");

      // Test création de concert
      const concertData = {
        title: "Concert Test",
        description: "Description du concert",
        performer: "Artiste Test",
        time: "20:00",
        location: "Salle de concert",
        image: "test.jpg",
      };

      const concertResponse = await axios.post(
        `${API_BASE_URL}/concerts`,
        concertData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("✅ Concert créé");

      // Test création de jour
      const dayData = {
        title: "Jour Test",
        date: "2024-12-31",
      };

      const dayResponse = await axios.post(`${API_BASE_URL}/days`, dayData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Jour créé");

      // Test création de POI
      const poiData = {
        title: "POI Test",
        type: "restaurant",
        latitude: 45.5017,
        longitude: -73.5673,
        description: "Restaurant de test",
      };

      const poiResponse = await axios.post(`${API_BASE_URL}/pois`, poiData);
      console.log("✅ POI créé");

      console.log("\n🎉 Tous les tests sont passés avec succès !");
      console.log("\n📋 Résumé des endpoints testés :");
      console.log("- POST /api/auth/login");
      console.log("- POST /api/admin/users");
      console.log("- POST /api/securityInfos");
      console.log("- POST /api/concerts");
      console.log("- POST /api/days");
      console.log("- POST /api/pois");
    } catch (error) {
      console.log(
        "❌ Erreur lors de la connexion:",
        error.response?.data?.message || error.message
      );
    }
  } catch (error) {
    console.error("❌ Erreur générale:", error.message);
  }
}

// Fonction pour afficher l'aide
function showHelp() {
  console.log(`
🚀 Nation Sounds API - Guide de test

COMMANDES DISPONIBLES:
  node test-api.js          - Tester l'API (serveur doit être démarré)
  npm run dev               - Démarrer le serveur de développement
  npm test                  - Exécuter les tests unitaires
  npm run build             - Compiler le projet

ENDPOINTS PRINCIPAUX:
  GET    /api/securityInfos - Récupérer les informations de sécurité
  POST   /api/securityInfos - Créer une information de sécurité (auth requise)
  GET    /api/concerts      - Récupérer les concerts
  POST   /api/concerts      - Créer un concert (auth requise)
  GET    /api/days          - Récupérer les jours
  POST   /api/days          - Créer un jour (auth requise)
  GET    /api/pois          - Récupérer les POIs
  POST   /api/pois          - Créer un POI
  POST   /api/auth/login    - Se connecter
  POST   /api/admin/users   - Créer un utilisateur (admin)

AUTHENTIFICATION:
  Pour les endpoints protégés, ajoutez l'en-tête:
  Authorization: Bearer <token>

EXEMPLE DE REQUÊTE:
  curl -X POST http://localhost:3000/api/auth/login \\
    -H "Content-Type: application/json" \\
    -d '{"email":"admin@example.com","password":"admin123"}'
`);
}

// Vérifier les arguments
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  showHelp();
} else {
  testAPI();
}
