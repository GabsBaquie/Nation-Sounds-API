#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

const command = process.argv[2];

console.log("🗄️ Gestionnaire de base de données Nation Sounds\n");

switch (command) {
  case "init":
    console.log("🔧 Initialisation de la base de données...");
    execSync("node database/scripts/init-database.js", { stdio: "inherit" });
    break;

  case "views":
    console.log("🔧 Création des vues...");
    execSync("node database/scripts/create-all-views.js", { stdio: "inherit" });
    break;

  case "test":
    console.log("🧪 Test des vues...");
    execSync("node database/scripts/manager.js", { stdio: "inherit" });
    break;

  case "fix-admin":
    console.log("🔧 Correction du mot de passe admin...");
    execSync("node database/scripts/fix-admin-password.js", {
      stdio: "inherit",
    });
    break;

  case "security":
    console.log("🔒 Application des corrections de sécurité...");
    execSync("node scripts/apply-security-fixes.js", { stdio: "inherit" });
    break;

  case "verify-security":
    console.log("🔍 Vérification de la sécurité...");
    execSync("node scripts/verify-security.js", { stdio: "inherit" });
    break;

  case "seed":
    console.log("🌱 Ajout de données de test...");
    execSync("node scripts/seed-test-data.js", { stdio: "inherit" });
    break;

  case "clean":
    console.log("🧹 Nettoyage et ajout de données...");
    execSync("node scripts/clean-and-seed.js", { stdio: "inherit" });
    break;

  case "all":
    console.log("🚀 Configuration complète de la base de données...");
    try {
      execSync("node database/scripts/init-database.js", { stdio: "inherit" });
      execSync("node database/scripts/create-all-views.js", {
        stdio: "inherit",
      });
      execSync("node scripts/apply-security-fixes.js", { stdio: "inherit" });
      execSync("node database/scripts/fix-admin-password.js", {
        stdio: "inherit",
      });
      console.log("\n✅ Configuration complète terminée !");
    } catch (error) {
      console.error("❌ Erreur lors de la configuration:", error.message);
      process.exit(1);
    }
    break;

  case "help":
  default:
    console.log("📋 Commandes disponibles :");
    console.log("");
    console.log("  init           - Initialiser la base de données");
    console.log("  views          - Créer les vues");
    console.log("  test           - Tester les vues");
    console.log("  fix-admin      - Corriger le mot de passe admin");
    console.log("  security       - Appliquer les corrections de sécurité");
    console.log("  verify-security - Vérifier la sécurité");
    console.log("  seed           - Ajouter des données de test");
    console.log("  clean          - Nettoyer et ajouter des données");
    console.log("  all            - Configuration complète");
    console.log("  help           - Afficher cette aide");
    console.log("");
    console.log("Exemples :");
    console.log("  node db.js init");
    console.log("  node db.js security");
    console.log("  node db.js all");
    break;
}
