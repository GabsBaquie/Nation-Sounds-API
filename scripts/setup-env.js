const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function setupEnvironment() {
  console.log("🔧 Configuration de l'environnement de test...\n");

  console.log("Pour configurer Supabase, vous avez besoin de :");
  console.log("1. L'URL de connexion à votre base de données");
  console.log("2. Le mot de passe de votre base de données");
  console.log("3. Le secret JWT\n");

  const databaseUrl = await question(
    "Entrez l'URL de connexion à votre base de données Supabase : "
  );
  const jwtSecret =
    (await question(
      "Entrez le secret JWT (ou laissez vide pour un secret par défaut) : "
    )) || "your-jwt-secret-for-testing";
  const frontendUrl =
    (await question(
      "Entrez l'URL du frontend (ou laissez vide pour localhost:3000) : "
    )) || "http://localhost:3000";

  const envContent = `# Configuration de test pour Supabase
NODE_ENV=test

# Base de données Supabase
DATABASE_URL=${databaseUrl}

# JWT Secret pour les tests
JWT_SECRET=${jwtSecret}

# Frontend URL pour les tests
FRONTEND_URL=${frontendUrl}

# Configuration email pour les tests (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
`;

  fs.writeFileSync(".env.test", envContent);
  console.log("\n✅ Fichier .env.test créé avec succès !");

  rl.close();
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

setupEnvironment().catch(console.error);
