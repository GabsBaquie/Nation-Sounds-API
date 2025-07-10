// src/utils/seed.ts
import { AppDataSource } from "../data-source";
import { seedDaysAndConcerts } from "../seeds/day-concert.seed";
import { seedPois } from "../seeds/poi.seed";
import { seedSecurityInfos } from "../seeds/security.seed";
import { seedUsers } from "../seeds/user.seed";

const cleanDatabase = async (dataSource: typeof AppDataSource) => {
  // Respecter l'ordre des contraintes FK
  const entities = [
    "concert_days_day", // table de jointure ManyToMany
    "day",
    "concert",
    "poi",
    "security_info",
    "user",
  ];
  for (const entity of entities) {
    try {
      await dataSource.query(
        `TRUNCATE TABLE "${entity}" RESTART IDENTITY CASCADE;`
      );
      console.log(`Table ${entity} nettoyée.`);
    } catch (e) {
      console.error(`Erreur lors du nettoyage de ${entity}:`, e);
    }
  }
};

AppDataSource.initialize()
  .then(async () => {
    console.log("🌱 Nettoyage de la base...");
    await cleanDatabase(AppDataSource);
    console.log("🌱 Seeding DB...");
    await seedUsers(AppDataSource);
    await seedSecurityInfos(AppDataSource);
    await seedDaysAndConcerts(AppDataSource);
    await seedPois(AppDataSource);
    await AppDataSource.destroy();
    console.log("✅ Seed terminé.");
  })
  .catch((error) => {
    console.error("❌ Erreur lors du seed :", error);
    process.exit(1);
  });
