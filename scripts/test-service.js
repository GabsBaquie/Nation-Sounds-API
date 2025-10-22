#!/usr/bin/env node

const { DayService } = require("../dist/src/services/DayService");

async function testDayService() {
  try {
    console.log("🧪 Test du DayService...");

    // Test de création
    console.log("1. Test de création d'un jour...");
    const day = await DayService.create({
      title: "Jour Test Service",
      date: "2024-12-31",
    });

    console.log("Résultat:", day);
    console.log("Type:", typeof day);
    console.log("Est null?", day === null);

    if (day) {
      console.log("✅ Création réussie!");
      console.log("ID:", day.id);
      console.log("Title:", day.title);

      // Test de récupération
      console.log("\n2. Test de récupération...");
      const foundDay = await DayService.findById(day.id);
      console.log("Jour trouvé:", foundDay);

      // Nettoyage
      console.log("\n3. Nettoyage...");
      // Note: Pas de méthode delete dans DayService, on laisse la DB se nettoyer
    } else {
      console.log("❌ Création échouée - retourne null");
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    console.error("Stack:", error.stack);
  }
}

testDayService();
