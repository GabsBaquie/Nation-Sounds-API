const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Démarrage de l'API avec .env.test...");

// Démarrer l'API avec le fichier .env.test
const apiProcess = spawn("node", ["dist/index.js"], {
  env: {
    ...process.env,
    NODE_ENV: "test",
  },
  stdio: "inherit",
});

// Gérer l'arrêt propre
process.on("SIGINT", () => {
  console.log("\n🛑 Arrêt de l'API...");
  apiProcess.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Arrêt de l'API...");
  apiProcess.kill("SIGTERM");
  process.exit(0);
});

apiProcess.on("close", (code) => {
  console.log(`API arrêtée avec le code ${code}`);
});
