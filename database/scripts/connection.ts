import * as dotenv from "dotenv";
import { Pool, PoolClient } from "pg";

if (process.env.NODE_ENV === "production") {
  // En production (Vercel), utiliser les variables d'environnement directement
  console.log(
    "Mode production - utilisation des variables d'environnement Vercel"
  );
} else {
  dotenv.config();
  console.log("Chargement de .env");
}

// URL de base de données
const postgresUrl = process.env.DATABASE_URL;

// Vérification de l'URL
if (!postgresUrl) {
  console.error("❌ DATABASE_URL n'est pas définie");
  process.exit(1);
}

// Vérification du format de l'URL
if (!postgresUrl.includes("supabase.co")) {
  console.warn(
    "⚠️ L'URL de base de données ne semble pas être une URL Supabase valide"
  );
}

console.log(
  "PostgreSQL URL utilisée :",
  postgresUrl?.replace(/:[^:]*@/, ":****@")
);

console.log("NODE_ENV:", process.env.NODE_ENV);

// Configuration du pool de connexions
const poolConfig = {
  connectionString: postgresUrl,
  ssl: false, // À activer si tu te connectes à une BDD distante sécurisée
  max: 20, // Nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000, // Fermer les connexions inactives après 30s
  connectionTimeoutMillis: 2000, // Timeout de connexion
};

export const pool = new Pool(poolConfig);

// Fonction pour exécuter une requête
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log("Query executed", { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// Fonction pour obtenir une transaction
export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

// Fonction pour exécuter une transaction
export const transaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Test de connexion
export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await query("SELECT NOW()");
    console.log("✅ Connexion à la base de données réussie !", result.rows[0]);
    return true;
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données:", error);
    return false;
  }
};

// Fermer le pool de connexions
export const closePool = async (): Promise<void> => {
  await pool.end();
};
