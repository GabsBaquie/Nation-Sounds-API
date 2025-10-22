#!/usr/bin/env node

const { DayService } = require("../dist/src/services/DayService");
const { ConcertService } = require("../dist/src/services/ConcertService");
const { PoiService } = require("../dist/src/services/PoiService");
const {
  SecurityInfoService,
} = require("../dist/src/services/SecurityInfoService");

async function testAllServices() {
  try {
    console.log("🧪 Test de tous les services...\n");

    // Test DayService
    console.log("1️⃣ Test DayService...");
    const day = await DayService.create({
      title: "Jour Test",
      date: "2024-12-31",
    });
    console.log("DayService.create():", day ? "✅ Succès" : "❌ Échec");

    // Test ConcertService
    console.log("\n2️⃣ Test ConcertService...");
    const concert = await ConcertService.create({
      title: "Concert Test",
      description: "Description test",
      performer: "Artiste Test",
      time: "20:00",
      location: "Salle Test",
    });
    console.log("ConcertService.create():", concert ? "✅ Succès" : "❌ Échec");

    // Test PoiService
    console.log("\n3️⃣ Test PoiService...");
    const poi = await PoiService.create({
      title: "POI Test",
      type: "restaurant",
      latitude: 48.8566,
      longitude: 2.3522,
    });
    console.log("PoiService.create():", poi ? "✅ Succès" : "❌ Échec");

    // Test SecurityInfoService
    console.log("\n4️⃣ Test SecurityInfoService...");
    const securityInfo = await SecurityInfoService.create({
      title: "Info Test",
      description: "Description test",
      urgence: false,
      actif: true,
    });
    console.log(
      "SecurityInfoService.create():",
      securityInfo ? "✅ Succès" : "❌ Échec"
    );

    console.log("\n🎉 Tests terminés !");
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    console.error("Stack:", error.stack);
  }
}

testAllServices();
