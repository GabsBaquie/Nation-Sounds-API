const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env.test" });

async function initTestDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Connexion à la base de données...");
    const client = await pool.connect();

    console.log("Lecture du script SQL...");
    const sqlScript = fs.readFileSync(
      path.join(__dirname, "src/scripts/init-db.sql"),
      "utf8"
    );

    console.log("Exécution du script SQL...");
    await client.query(sqlScript);

    console.log("✅ Base de données initialisée avec succès !");

    client.release();
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'initialisation de la base de données:",
      error
    );
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initTestDatabase();
