const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env.test" });

async function createAllViews() {
  console.log("🔧 Création de toutes les vues dans la base de données...\n");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();

    // Liste des fichiers SQL à exécuter
    const sqlFiles = [
      path.join(__dirname, "../views/overview.sql"),
      path.join(__dirname, "../views/analytics.sql"),
    ];

    for (const sqlFile of sqlFiles) {
      console.log(`📖 Lecture de ${sqlFile}...`);

      if (!fs.existsSync(sqlFile)) {
        console.log(`⚠️  Fichier ${sqlFile} non trouvé, ignoré.`);
        continue;
      }

      const sqlScript = fs.readFileSync(sqlFile, "utf8");

      console.log(`⚡ Exécution de ${sqlFile}...`);
      await client.query(sqlScript);
      console.log(`✅ ${sqlFile} exécuté avec succès !\n`);
    }

    // Tester les vues créées
    console.log("🧪 Test des vues créées :\n");

    // Test de la vue full_db
    try {
      const fullDbResult = await client.query(
        "SELECT COUNT(*) as total FROM full_db"
      );
      console.log(
        `📊 Vue full_db : ${fullDbResult.rows[0].total} enregistrements`
      );
    } catch (error) {
      console.log(`❌ Erreur vue full_db : ${error.message}`);
    }

    // Test de la vue public_data
    try {
      const publicDataResult = await client.query(
        "SELECT COUNT(*) as total FROM public_data"
      );
      console.log(
        `🌐 Vue public_data : ${publicDataResult.rows[0].total} enregistrements`
      );
    } catch (error) {
      console.log(`❌ Erreur vue public_data : ${error.message}`);
    }

    // Test de la vue db_stats
    try {
      const statsResult = await client.query(
        "SELECT * FROM db_stats ORDER BY table_name"
      );
      console.log("\n📈 Statistiques de la base de données :");
      statsResult.rows.forEach((row) => {
        console.log(
          `- ${row.table_name}: ${row.count} enregistrements (dernier: ${
            row.last_created || "N/A"
          })`
        );
      });
    } catch (error) {
      console.log(`❌ Erreur vue db_stats : ${error.message}`);
    }

    // Test de la vue poi_stats_by_type
    try {
      const poiStatsResult = await client.query(
        "SELECT * FROM poi_stats_by_type"
      );
      console.log("\n📍 Statistiques des POIs par type :");
      poiStatsResult.rows.forEach((row) => {
        console.log(`- ${row.type}: ${row.count} POIs`);
      });
    } catch (error) {
      console.log(`❌ Erreur vue poi_stats_by_type : ${error.message}`);
    }

    // Afficher quelques exemples de données
    console.log("\n🔍 Exemples de données de la vue full_db :");
    try {
      const examplesResult = await client.query(
        "SELECT source, data FROM full_db LIMIT 3"
      );
      examplesResult.rows.forEach((row, index) => {
        console.log(
          `${index + 1}. ${row.source}:`,
          JSON.stringify(row.data, null, 2)
        );
      });
    } catch (error) {
      console.log(`❌ Erreur exemples : ${error.message}`);
    }

    client.release();
    console.log("\n🎉 Configuration de toutes les vues terminée !");
  } catch (error) {
    console.error("❌ Erreur lors de la création des vues:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createAllViews();
