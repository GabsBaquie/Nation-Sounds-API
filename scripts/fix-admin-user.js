const bcrypt = require("bcrypt");
const { Pool } = require("pg");

// Configuration de la base de données
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:oSDtMiPZ3ij7RVnC@db.dtvryosgiqnwcfceazcj.supabase.co:5432/postgres",
});

async function fixAdminUser() {
  try {
    console.log("🔧 Correction de l'utilisateur admin...");

    // Mot de passe admin correct
    const adminPassword = "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Vérifier si l'utilisateur admin existe
    const existingAdmin = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      ["admin@example.com"]
    );

    if (existingAdmin.rows.length > 0) {
      console.log("📧 Utilisateur admin@example.com existe déjà");

      // Mettre à jour le mot de passe
      await pool.query('UPDATE "user" SET password = $1 WHERE email = $2', [
        hashedPassword,
        "admin@example.com",
      ]);

      console.log("✅ Mot de passe admin mis à jour !");
      console.log("📧 Email: admin@example.com");
      console.log("🔑 Mot de passe: admin123");
      console.log("👤 Rôle: admin");
    } else {
      // Créer l'utilisateur admin
      const result = await pool.query(
        `INSERT INTO "user" (username, email, password, role, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) 
         RETURNING id, username, email, role`,
        ["admin", "admin@example.com", hashedPassword, "admin"]
      );

      const newAdmin = result.rows[0];
      console.log("✅ Utilisateur admin créé avec succès !");
      console.log("📧 Email:", newAdmin.email);
      console.log("🔑 Mot de passe: admin123");
      console.log("👤 Rôle:", newAdmin.role);
      console.log("🆔 ID:", newAdmin.id);
    }

    // Tester la connexion
    console.log("\n🧪 Test de connexion...");
    const testUser = await pool.query('SELECT * FROM "user" WHERE email = $1', [
      "admin@example.com",
    ]);

    if (testUser.rows.length > 0) {
      const user = testUser.rows[0];
      const isPasswordValid = await bcrypt.compare(
        adminPassword,
        user.password
      );

      if (isPasswordValid) {
        console.log("✅ Test de connexion réussie !");
        console.log("📧 Email: admin@example.com");
        console.log("🔑 Mot de passe: admin123");
        console.log("👤 Rôle: admin");
      } else {
        console.log("❌ Erreur: Le mot de passe ne correspond pas");
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de la correction de l'admin:", error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
fixAdminUser();
