const { Pool } = require("pg");
require("dotenv").config({ path: ".env.test" });

async function testConnection() {
  console.log("🔍 Test de connexion à Supabase...\n");

  console.log("Configuration actuelle :");
  console.log("- NODE_ENV:", process.env.NODE_ENV);
  console.log(
    "- DATABASE_URL:",
    process.env.DATABASE_URL ? "Configurée" : "Non configurée"
  );
  console.log(
    "- JWT_SECRET:",
    process.env.JWT_SECRET ? "Configuré" : "Non configuré"
  );
  console.log("- FRONTEND_URL:", process.env.FRONTEND_URL || "Non configuré");

  if (!process.env.DATABASE_URL) {
    console.log("\n❌ DATABASE_URL non configurée dans .env.test");
    console.log("Exécutez : node setup-env.js");
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("\n🔌 Tentative de connexion...");
    const client = await pool.connect();

    console.log("✅ Connexion réussie !");

    // Test simple
    const result = await client.query("SELECT NOW() as current_time");
    console.log("⏰ Heure actuelle de la base :", result.rows[0].current_time);

    // Vérifier les tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log("\n📋 Tables existantes :");
    if (tablesResult.rows.length === 0) {
      console.log("⚠️  Aucune table trouvée. Exécutez : node init-test-db.js");
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`- ${row.table_name}`);
      });
    }

    client.release();
    console.log("\n🎉 Test de connexion réussi !");
  } catch (error) {
    console.log("\n❌ Erreur de connexion :");
    console.log("Code:", error.code);
    console.log("Message:", error.message);

    if (error.code === "28P01") {
      console.log("\n💡 Solution : Vérifiez le mot de passe dans DATABASE_URL");
    } else if (error.code === "ENOTFOUND") {
      console.log("\n💡 Solution : Vérifiez l'URL de connexion");
    }
  } finally {
    await pool.end();
  }
}

testConnection();
