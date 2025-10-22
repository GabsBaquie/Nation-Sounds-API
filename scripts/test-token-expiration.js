#!/usr/bin/env node

const { UserService } = require("../dist/src/services/UserService");

async function testTokenExpiration() {
  try {
    console.log("🧪 Test de l'expiration des tokens...\n");

    // Créer un utilisateur de test
    const user = await UserService.findByEmail("admin@example.com");
    if (!user) {
      console.log("❌ Utilisateur admin non trouvé");
      return;
    }

    console.log("1. Utilisateur trouvé:", user.email);

    // Créer un token expiré
    const expiredToken = "expired-token-test";
    const pastExpiration = new Date(Date.now() - 3600000); // 1 heure dans le passé

    console.log("2. Création d'un token expiré...");
    const updateResult = await UserService.updateResetToken(
      user.email,
      expiredToken,
      pastExpiration
    );
    console.log("Token créé:", updateResult);

    // Tester la réinitialisation avec le token expiré
    console.log("3. Test de réinitialisation avec token expiré...");
    const resetResult = await UserService.resetPassword(
      expiredToken,
      "newPassword123"
    );
    console.log("Résultat de réinitialisation:", resetResult);

    if (resetResult) {
      console.log("❌ Le token expiré a été accepté (problème !)");
    } else {
      console.log("✅ Le token expiré a été rejeté (correct !)");
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    console.error("Stack:", error.stack);
  }
}

testTokenExpiration();
