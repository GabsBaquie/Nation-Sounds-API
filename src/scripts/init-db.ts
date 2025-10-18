import * as fs from "fs";
import * as path from "path";
import { query, testConnection } from "../database/connection";

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log("🌱 Initialisation de la base de données...");

    // Tester la connexion
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Impossible de se connecter à la base de données");
    }

    // Lire le fichier SQL
    const sqlPath = path.join(__dirname, "init-db.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    // Exécuter le script SQL
    await query(sqlContent);

    console.log("✅ Base de données initialisée avec succès !");
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'initialisation de la base de données:",
      error
    );
    throw error;
  }
};

// Exécuter si le script est appelé directement
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("🎉 Initialisation terminée !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Échec de l'initialisation:", error);
      process.exit(1);
    });
}
