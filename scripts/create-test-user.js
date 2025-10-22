const bcrypt = require("bcrypt");
const { Pool } = require("pg");

// Configuration de la base de données
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:oSDtMiPZ3ij7RVnC@db.dtvryosgiqnwcfceazcj.supabase.co:5432/postgres",
});

async function createTestUser() {
  try {
    console.log("🔧 Création d'un utilisateur de test...");

    // Mot de passe de test
    const testPassword = "test123";
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Données de l'utilisateur de test
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      role: "admin",
    };

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      [userData.email]
    );

    if (existingUser.rows.length > 0) {
      console.log("⚠️ Utilisateur test@example.com existe déjà");
      console.log("📧 Email: test@example.com");
      console.log("🔑 Mot de passe: test123");
      return;
    }

    // Créer l'utilisateur
    const result = await pool.query(
      `INSERT INTO "user" (username, email, password, role, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id, username, email, role`,
      [userData.username, userData.email, userData.password, userData.role]
    );

    const newUser = result.rows[0];

    console.log("✅ Utilisateur de test créé avec succès !");
    console.log("📧 Email:", newUser.email);
    console.log("🔑 Mot de passe: test123");
    console.log("👤 Rôle:", newUser.role);
    console.log("🆔 ID:", newUser.id);
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'utilisateur:", error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
createTestUser();
