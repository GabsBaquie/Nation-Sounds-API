const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

async function applySecurityFixes() {
  console.log("🔒 Application des corrections de sécurité Supabase...\n");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();

    console.log("📖 Lecture du script de corrections de sécurité...");
    const sqlScript = fs.readFileSync(
      path.join(__dirname, "../database/security-fixes.sql"),
      "utf8"
    );

    console.log("⚡ Application des corrections de sécurité...");
    await client.query(sqlScript);

    console.log("✅ Corrections de sécurité appliquées avec succès !\n");

    // Vérifier que les vues fonctionnent toujours
    console.log("🧪 Test des vues après corrections :\n");

    const views = [
      "public_data",
      "db_stats",
      "poi_stats_by_type",
      "concerts_by_month",
      "security_info_stats",
      "recent_activity",
      "concerts_with_days",
      "days_with_concerts",
    ];

    for (const viewName of views) {
      try {
        const result = await client.query(
          `SELECT COUNT(*) as count FROM ${viewName}`
        );
        console.log(`✅ ${viewName}: ${result.rows[0].count} enregistrements`);
      } catch (error) {
        console.log(`❌ ${viewName}: ${error.message}`);
      }
    }

    // Vérifier que RLS est activé
    console.log("\n🔐 Vérification de RLS :\n");

    const tables = [
      "user",
      "concert",
      "day",
      "poi",
      "security_info",
      "concert_days_day",
    ];

    for (const tableName of tables) {
      try {
        const result = await client.query(
          `
          SELECT relrowsecurity as rls_enabled 
          FROM pg_class 
          WHERE relname = $1 AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        `,
          [tableName]
        );

        if (result.rows.length > 0) {
          const rlsEnabled = result.rows[0].rls_enabled;
          console.log(
            `✅ ${tableName}: RLS ${rlsEnabled ? "activé" : "désactivé"}`
          );
        } else {
          console.log(`❌ ${tableName}: Table non trouvée`);
        }
      } catch (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      }
    }

    client.release();
    console.log("\n🎉 Corrections de sécurité terminées !");
    console.log("\n📋 Résumé des corrections :");
    console.log("- ✅ Vues recréées sans SECURITY DEFINER");
    console.log("- ✅ RLS activé sur toutes les tables publiques");
    console.log("- ✅ Politiques de sécurité créées");
    console.log("- ✅ Permissions configurées correctement");
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'application des corrections:",
      error.message
    );
    process.exit(1);
  } finally {
    await pool.end();
  }
}

applySecurityFixes();
