#!/usr/bin/env node

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Configuration de la base de données
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:oSDtMiPZ3ij7RVnC@db.dtvryosgiqnwcfceazcj.supabase.co:5432/postgres",
});

async function runSeed() {
  const client = await pool.connect();

  try {
    console.log("🌱 Début du seed des données...");

    // Lire le fichier seed-global-data.sql
    const seedPath = path.join(__dirname, "seed-global-data.sql");
    const seedSQL = fs.readFileSync(seedPath, "utf8");

    // Exécuter le script SQL
    await client.query(seedSQL);

    console.log("✅ Seed terminé avec succès !");

    // Vérifier les données insérées
    const result = await client.query(`
      SELECT 'Partenaires' as table_name, COUNT(*) as count FROM partenaire
      UNION ALL
      SELECT 'Actualités', COUNT(*) FROM actualite
      UNION ALL
      SELECT 'Jours', COUNT(*) FROM day
      UNION ALL
      SELECT 'Concerts', COUNT(*) FROM concert
      UNION ALL
      SELECT 'POI', COUNT(*) FROM poi
      UNION ALL
      SELECT 'Infos sécurité', COUNT(*) FROM security_info
      ORDER BY table_name;
    `);

    console.log("\n📊 Données insérées :");
    result.rows.forEach((row) => {
      console.log(`  ${row.table_name}: ${row.count} entrées`);
    });
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter le seed si le script est appelé directement
if (require.main === module) {
  runSeed()
    .then(() => {
      console.log("🎉 Seed terminé !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur fatale:", error);
      process.exit(1);
    });
}

module.exports = { runSeed };
