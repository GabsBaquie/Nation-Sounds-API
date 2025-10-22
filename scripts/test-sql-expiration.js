#!/usr/bin/env node

const { query } = require("../dist/database/scripts/connection");

async function testSqlExpiration() {
  try {
    console.log("🧪 Test de la requête SQL d'expiration...\n");

    // Créer un token expiré
    const expiredToken = "expired-token-sql-test";
    const pastExpiration = new Date(Date.now() - 3600000); // 1 heure dans le passé

    console.log("1. Date d'expiration créée:", pastExpiration);
    console.log("2. Date actuelle (NOW()):", new Date());

    // Insérer le token expiré
    await query(
      'UPDATE "user" SET "resetToken" = $1, "resetTokenExpiration" = $2 WHERE email = $3',
      [expiredToken, pastExpiration, "admin@example.com"]
    );

    console.log("3. Token expiré inséré");

    // Tester la requête SQL
    const result = await query(
      'SELECT id FROM "user" WHERE "resetToken" = $1 AND "resetTokenExpiration" > NOW()',
      [expiredToken]
    );

    console.log("4. Résultat de la requête SQL:", result.rows);

    if (result.rows.length === 0) {
      console.log("✅ La requête SQL rejette correctement le token expiré");
    } else {
      console.log("❌ La requête SQL accepte incorrectement le token expiré");
    }

    // Tester avec un token valide
    const futureExpiration = new Date(Date.now() + 3600000); // 1 heure dans le futur
    const validToken = "valid-token-sql-test";

    await query(
      'UPDATE "user" SET "resetToken" = $1, "resetTokenExpiration" = $2 WHERE email = $3',
      [validToken, futureExpiration, "admin@example.com"]
    );

    const result2 = await query(
      'SELECT id FROM "user" WHERE "resetToken" = $1 AND "resetTokenExpiration" > NOW()',
      [validToken]
    );

    console.log("5. Résultat avec token valide:", result2.rows);

    if (result2.rows.length > 0) {
      console.log("✅ La requête SQL accepte correctement le token valide");
    } else {
      console.log("❌ La requête SQL rejette incorrectement le token valide");
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    console.error("Stack:", error.stack);
  }
}

testSqlExpiration();
