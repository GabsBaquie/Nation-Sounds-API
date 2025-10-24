const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env.test" });

async function fixAdminPassword() {
  console.log("🔧 Correction du mot de passe admin...\n");

  // Générer le hash du mot de passe "admin123"
  const password = "admin123";
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  console.log("Mot de passe:", password);
  console.log("Hash généré:", hashedPassword);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();

    // Mettre à jour le mot de passe de l'utilisateur admin
    const result = await client.query(
      'UPDATE "user" SET password = $1 WHERE email = $2',
      [hashedPassword, "admin@example.com"]
    );

    if (result.rowCount > 0) {
      console.log("✅ Mot de passe admin mis à jour avec succès !");
    } else {
      console.log("⚠️  Aucun utilisateur admin trouvé, création...");

      // Créer l'utilisateur admin
      await client.query(
        'INSERT INTO "user" (username, email, password, role) VALUES ($1, $2, $3, $4)',
        ["admin", "admin@example.com", hashedPassword, "admin"]
      );
      console.log("✅ Utilisateur admin créé avec succès !");
    }

    // Vérifier la connexion
    const user = await client.query(
      'SELECT id, username, email, role FROM "user" WHERE email = $1',
      ["admin@example.com"]
    );

    if (user.rows.length > 0) {
      console.log("\n👤 Utilisateur admin :");
      console.log("- ID:", user.rows[0].id);
      console.log("- Username:", user.rows[0].username);
      console.log("- Email:", user.rows[0].email);
      console.log("- Role:", user.rows[0].role);
    }

    client.release();
    console.log("\n🎉 Configuration terminée !");
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await pool.end();
  }
}

fixAdminPassword();
