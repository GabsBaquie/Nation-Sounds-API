#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

// Couleurs pour la console
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelp() {
  log("\n🗄️  Gestionnaire de base de données Nation Sounds\n", "bright");

  log("📋 Commandes disponibles:", "cyan");
  log("  node db.js init          - Initialiser la base de données", "green");
  log("  node db.js views         - Créer toutes les vues", "green");
  log("  node db.js test          - Tester toutes les vues", "green");
  log("  node db.js fix-admin     - Corriger le mot de passe admin", "green");
  log("  node db.js stats         - Afficher les statistiques", "green");
  log("  node db.js all           - Exécuter toutes les opérations", "green");
  log("  node db.js help          - Afficher cette aide", "green");

  log("\n📁 Structure des fichiers:", "cyan");
  log("  database/views/          - Vues SQL", "blue");
  log("  database/scripts/        - Scripts de gestion", "blue");
  log("  database/migrations/     - Migrations SQL", "blue");

  log("\n🔗 Documentation:", "cyan");
  log("  Voir database/README.md pour plus de détails", "blue");
}

async function runCommand(command, description) {
  try {
    log(`\n⚡ ${description}...`, "yellow");
    execSync(command, { stdio: "inherit" });
    log(`✅ ${description} terminé avec succès !`, "green");
  } catch (error) {
    log(
      `❌ Erreur lors de ${description.toLowerCase()}: ${error.message}`,
      "red"
    );
    process.exit(1);
  }
}

async function main() {
  const command = process.argv[2];

  if (!command || command === "help") {
    showHelp();
    return;
  }

  log("🗄️  Gestionnaire de base de données Nation Sounds\n", "bright");

  switch (command) {
    case "init":
      await runCommand(
        "node database/scripts/init-database.js",
        "Initialisation de la base de données"
      );
      break;

    case "views":
      await runCommand(
        "node database/scripts/create-all-views.js",
        "Création de toutes les vues"
      );
      break;

    case "test":
      await runCommand(
        "node database/scripts/db-manager.js",
        "Test de toutes les vues"
      );
      break;

    case "fix-admin":
      await runCommand(
        "node database/scripts/fix-admin-password.js",
        "Correction du mot de passe admin"
      );
      break;

    case "stats":
      await runCommand(
        "node database/scripts/db-manager.js",
        "Affichage des statistiques"
      );
      break;

    case "all":
      log("🚀 Exécution de toutes les opérations...\n", "magenta");

      await runCommand(
        "node database/scripts/init-database.js",
        "Initialisation de la base de données"
      );

      await runCommand(
        "node database/scripts/fix-admin-password.js",
        "Correction du mot de passe admin"
      );

      await runCommand(
        "node database/scripts/create-all-views.js",
        "Création de toutes les vues"
      );

      await runCommand(
        "node database/scripts/db-manager.js",
        "Test de toutes les vues"
      );

      log("\n🎉 Toutes les opérations terminées avec succès !", "green");
      break;

    default:
      log(`❌ Commande inconnue: ${command}`, "red");
      log(
        'Utilisez "node db.js help" pour voir les commandes disponibles.',
        "yellow"
      );
      process.exit(1);
  }
}

main().catch(console.error);
