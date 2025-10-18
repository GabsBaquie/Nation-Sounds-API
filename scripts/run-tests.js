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
  log("\n🧪 Gestionnaire de tests Nation Sounds\n", "bright");

  log("📋 Commandes disponibles:", "cyan");
  log("  node scripts/run-tests.js unit        - Tests unitaires", "green");
  log("  node scripts/run-tests.js integration - Tests d'intégration", "green");
  log("  node scripts/run-tests.js api         - Test de l'API", "green");
  log("  node scripts/run-tests.js all         - Tous les tests", "green");
  log("  node scripts/run-tests.js help        - Afficher cette aide", "green");

  log("\n📁 Structure des tests:", "cyan");
  log("  src/controllers/__tests__/ - Tests unitaires", "blue");
  log("  scripts/                   - Scripts de test", "blue");
  log("  tests/                     - Tests d'intégration", "blue");
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

  log("🧪 Gestionnaire de tests Nation Sounds\n", "bright");

  switch (command) {
    case "unit":
      await runCommand("npm test", "Tests unitaires");
      break;

    case "integration":
      await runCommand("node tests/start-and-test.sh", "Tests d'intégration");
      break;

    case "api":
      await runCommand("node tests/scripts/test-api.js", "Test de l'API");
      break;

    case "all":
      log("🚀 Exécution de tous les tests...\n", "magenta");

      await runCommand("npm test", "Tests unitaires");
      await runCommand("node tests/scripts/test-api.js", "Test de l'API");
      await runCommand("node tests/start-and-test.sh", "Tests d'intégration");

      log("\n🎉 Tous les tests terminés avec succès !", "green");
      break;

    default:
      log(`❌ Commande inconnue: ${command}`, "red");
      log(
        'Utilisez "node scripts/run-tests.js help" pour voir les commandes disponibles.',
        "yellow"
      );
      process.exit(1);
  }
}

main().catch(console.error);
