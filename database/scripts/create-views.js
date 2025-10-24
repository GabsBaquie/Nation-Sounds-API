const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env.test" });

async function createViews() {
  console.log("🔧 Création des vues dans la base de données...\n");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();

    console.log("📖 Lecture du script SQL...");
    const sqlScript = fs.readFileSync(
      path.join(__dirname, "create-view.sql"),
      "utf8"
    );

    console.log("⚡ Exécution du script SQL...");
    await client.query(sqlScript);

    console.log("✅ Vues créées avec succès !\n");

    // Tester les vues créées
    console.log("🧪 Test des vues créées :\n");

    // Test de la vue full_db
    const fullDbResult = await client.query("SELECT COUNT(*) as total FROM full_db");
    console.log(`📊 Vue full_db : ${fullDbResult.rows[0].total} enregistrements`);

    // Test de la vue public_data
    const publicDataResult = await client.query("SELECT COUNT(*) as total FROM public_data");
    console.log(`🌐 Vue public_data : ${publicDataResult.rows[0].total} enregistrements`);

    // Test de la vue db_stats
    const statsResult = await client.query("SELECT * FROM db_stats ORDER BY table_name");
    console.log("\n📈 Statistiques de la base de données :");
    statsResult.rows.forEach((row) => {
      console.log(`- ${row.table_name}: ${row.count} enregistrements (dernier: ${row.last_created || 'N/A'})`);
    });

    // Afficher quelques exemples de données
    console.log("\n🔍 Exemples de données de la vue full_db :");
    const examplesResult = await client.query("SELECT source, data FROM full_db LIMIT 3");
    examplesResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.source}:`, JSON.stringify(row.data, null, 2));
    });

    client.release();
    console.log("\n🎉 Configuration des vues terminée !");
  } catch (error) {
    console.error("❌ Erreur lors de la création des vues:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createViews();
