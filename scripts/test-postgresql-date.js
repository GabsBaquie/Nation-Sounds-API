#!/usr/bin/env node

const { query } = require("../dist/database/scripts/connection");

async function testPostgresqlDate() {
  try {
    console.log("🧪 Test des dates PostgreSQL...\n");

    const expiredToken = "expired-token-pg-test";

    // Utiliser une date PostgreSQL directement
    await query(
      'UPDATE "user" SET "resetToken" = $1, "resetTokenExpiration" = NOW() - INTERVAL \'1 hour\' WHERE email = $2',
      [expiredToken, "admin@example.com"]
    );

    console.log("1. Token expiré créé avec date PostgreSQL (NOW() - 1 hour)");

    // Tester la requête
    const result = await query(
      'SELECT id, "resetTokenExpiration", NOW() as current_time FROM "user" WHERE "resetToken" = $1',
      [expiredToken]
    );

    console.log("2. Token trouvé:", result.rows[0]);

    // Tester la condition d'expiration
    const result2 = await query(
      'SELECT id FROM "user" WHERE "resetToken" = $1 AND "resetTokenExpiration" > NOW()',
      [expiredToken]
    );

    console.log("3. Résultat de la condition d'expiration:", result2.rows);

    if (result2.rows.length === 0) {
      console.log("✅ Le token expiré est correctement rejeté");
    } else {
      console.log("❌ Le token expiré est incorrectement accepté");
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    console.error("Stack:", error.stack);
  }
}

testPostgresqlDate();
