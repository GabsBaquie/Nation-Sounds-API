import bcrypt from "bcrypt";
import request from "supertest";
import { query, testConnection } from "../../database/scripts/connection";
import { UserRole } from "../dto/requests/user.dto";
import app from "../index";
import { UserService } from "../services/UserService";

/**
 * Initialise la connexion à la base de données pour les tests.
 */
export const initializeTestDB = async () => {
  // Vérifier si nous sommes en environnement de production ou si les tests doivent être ignorés
  if (
    process.env.NODE_ENV === "production" ||
    process.env.SKIP_TESTS === "true"
  ) {
    console.log("Tests ignorés en environnement de production.");
    return;
  }

  try {
    console.log("Initialisation de la base de données de test...");
    console.log(
      `URL de connexion: ${
        process.env.DATABASE_URL ? "Configurée" : "Manquante"
      }`
    );

    if (!process.env.DATABASE_URL) {
      // En environnement de déploiement, ne pas faire échouer les tests s'il n'y a pas de base de données
      if (process.env.HEROKU || process.env.RAILWAY) {
        console.log(
          "Environnement de déploiement détecté. Les tests ne seront pas exécutés."
        );
        return;
      }

      console.error("La variable DATABASE_URL n'est pas définie.");
      console.error("Veuillez configurer une base de données de test valide.");
      throw new Error("Configuration de base de données de test manquante");
    }

    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error(
        "Impossible de se connecter à la base de données de test"
      );
    }

    console.log("Connexion à la base de données de test réussie !");

    if (process.env.NODE_ENV === "test") {
      console.log("Nettoyage de la base de données de test...");
      await cleanTestDatabase();
      console.log("Base de données de test nettoyée avec succès.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données de test:",
      error
    );
    // En environnement de déploiement, ne pas faire échouer les tests
    if (process.env.HEROKU || process.env.RAILWAY) {
      console.log(
        "Environnement de déploiement détecté. Les tests ne seront pas bloquants."
      );
      return;
    }
    throw error;
  }
};

/**
 * Nettoie la base de données de test
 */
const cleanTestDatabase = async () => {
  try {
    // Nettoyer les tables dans l'ordre pour respecter les contraintes FK
    // Ignorer les erreurs si les tables n'existent pas
    try {
      await query('DELETE FROM "day"');
    } catch (error) {
      console.log('Table "day" n\'existe pas ou est vide');
    }

    try {
      await query('DELETE FROM "concert"');
    } catch (error) {
      console.log('Table "concert" n\'existe pas ou est vide');
    }

    try {
      await query('DELETE FROM "poi"');
    } catch (error) {
      console.log('Table "poi" n\'existe pas ou est vide');
    }

    try {
      await query('DELETE FROM "security_info"');
    } catch (error) {
      console.log('Table "security_info" n\'existe pas ou est vide');
    }

    try {
      await query('DELETE FROM "user"');
    } catch (error) {
      console.log('Table "user" n\'existe pas ou est vide');
    }

    // Réinitialiser les séquences si elles existent
    try {
      await query('ALTER SEQUENCE "user_id_seq" RESTART WITH 1');
    } catch (error) {
      console.log('Séquence "user_id_seq" n\'existe pas');
    }

    try {
      await query('ALTER SEQUENCE "day_id_seq" RESTART WITH 1');
    } catch (error) {
      console.log('Séquence "day_id_seq" n\'existe pas');
    }

    try {
      await query('ALTER SEQUENCE "concert_id_seq" RESTART WITH 1');
    } catch (error) {
      console.log('Séquence "concert_id_seq" n\'existe pas');
    }

    try {
      await query('ALTER SEQUENCE "poi_id_seq" RESTART WITH 1');
    } catch (error) {
      console.log('Séquence "poi_id_seq" n\'existe pas');
    }

    try {
      await query('ALTER SEQUENCE "security_info_id_seq" RESTART WITH 1');
    } catch (error) {
      console.log('Séquence "security_info_id_seq" n\'existe pas');
    }
  } catch (error) {
    console.error(
      "Erreur lors du nettoyage de la base de données de test:",
      error
    );
    // Ne pas faire échouer les tests pour des erreurs de nettoyage
    console.log("Continuer malgré les erreurs de nettoyage...");
  }
};

/**
 * Ferme la connexion à la base de données après les tests.
 */
export const closeTestDB = async () => {
  // Ignorer si nous sommes en environnement de production ou si les tests doivent être ignorés
  if (
    process.env.NODE_ENV === "production" ||
    process.env.SKIP_TESTS === "true"
  ) {
    return;
  }

  try {
    console.log("Fermeture de la connexion à la base de données de test...");

    // Fermer explicitement le pool de connexions
    const { pool } = await import("../../database/scripts/connection");
    if (pool) {
      await pool.end();
      console.log("Pool de connexions fermé avec succès.");
    }

    console.log("Connexion à la base de données de test fermée avec succès.");
  } catch (error) {
    console.error(
      "Erreur lors de la fermeture de la connexion à la base de données de test:",
      error
    );
  }
};

/**
 * Crée un utilisateur admin par défaut pour les tests.
 * @returns Le token JWT de l'administrateur.
 */
export const createAdminUser = async (): Promise<string> => {
  // Mock si nous sommes en environnement de production ou si les tests doivent être ignorés
  if (
    process.env.NODE_ENV === "production" ||
    process.env.SKIP_TESTS === "true"
  ) {
    return "mock-token-for-production";
  }

  try {
    // Vérifie si l'utilisateur admin existe déjà
    const existingAdmin = await UserService.findByEmail("admin@example.com");
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("adminPass123", 10);
      await UserService.create({
        username: "adminuser",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin" as UserRole,
      });
    }

    // Se connecter en tant qu'admin pour obtenir le token
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "adminPass123",
    });

    return res.body.token;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur admin:", error);
    throw error;
  }
};
