const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Configuration de la base de données
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

async function createTestToken() {
  try {
    // Générer un token de test
    const testToken = uuidv4();
    const expirationDate = new Date(Date.now() + 3600000); // Expire dans 1 heure

    console.log("Token généré:", testToken);
    console.log("Expiration:", expirationDate);

    // Mettre à jour un utilisateur avec ce token (supposons qu'il y ait un utilisateur avec l'email 'test@example.com')
    const result = await pool.query(
      'UPDATE "user" SET "resetToken" = $1, "resetTokenExpiration" = $2 WHERE email = $3',
      [testToken, expirationDate, "test@example.com"]
    );

    if (result.rowCount > 0) {
      console.log("Token créé avec succès pour test@example.com");
      console.log(
        "URL de test: http://localhost:3000/reset-password/" + testToken
      );
    } else {
      console.log("Aucun utilisateur trouvé avec l'email test@example.com");
      // Créer un utilisateur de test
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash("password123", 10);

      await pool.query(
        'INSERT INTO "user" (email, password, "resetToken", "resetTokenExpiration") VALUES ($1, $2, $3, $4)',
        ["test@example.com", hashedPassword, testToken, expirationDate]
      );

      console.log("Utilisateur de test créé avec le token");
      console.log(
        "URL de test: http://localhost:3000/reset-password/" + testToken
      );
    }
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await pool.end();
  }
}

createTestToken();
