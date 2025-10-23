const { Pool } = require("pg");

// Configuration de la base de données
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:oSDtMiPZ3ij7RVnC@db.dtvryosgiqnwcfceazcj.supabase.co:5432/postgres",
});

async function seedTestData() {
  try {
    console.log("🌱 Ajout des données de test...");

    // 1. Créer des jours de test
    console.log("📅 Création des jours de test...");
    const day1 = await pool.query(
      `INSERT INTO day (title, date, created_at) 
       VALUES ($1, $2, NOW()) 
       RETURNING id`,
      ["Jour 1 - Vendredi", "2024-07-05"]
    );
    const day2 = await pool.query(
      `INSERT INTO day (title, date, created_at) 
       VALUES ($1, $2, NOW()) 
       RETURNING id`,
      ["Jour 2 - Samedi", "2024-07-06"]
    );
    const day3 = await pool.query(
      `INSERT INTO day (title, date, created_at) 
       VALUES ($1, $2, NOW()) 
       RETURNING id`,
      ["Jour 3 - Dimanche", "2024-07-07"]
    );

    console.log(
      `✅ Jours créés - IDs: ${day1.rows[0].id}, ${day2.rows[0].id}, ${day3.rows[0].id}`
    );

    // 2. Créer des concerts de test
    console.log("🎵 Création des concerts de test...");
    const concert1 = await pool.query(
      `INSERT INTO concert (title, description, performer, time, location, image, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Rock Festival 2024",
        "Un festival de rock incroyable",
        "The Rock Band",
        "20:00",
        "Scène principale",
        "rock-festival.jpg",
      ]
    );
    const concert2 = await pool.query(
      `INSERT INTO concert (title, description, performer, time, location, image, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Jazz Night",
        "Soirée jazz élégante",
        "Jazz Masters",
        "21:30",
        "Scène jazz",
        "jazz-night.jpg",
      ]
    );
    const concert3 = await pool.query(
      `INSERT INTO concert (title, description, performer, time, location, image, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Electronic Music",
        "Musique électronique moderne",
        "DJ Electro",
        "22:00",
        "Scène électronique",
        "electronic.jpg",
      ]
    );

    console.log(
      `✅ Concerts créés - IDs: ${concert1.rows[0].id}, ${concert2.rows[0].id}, ${concert3.rows[0].id}`
    );

    // 3. Associer les concerts aux jours
    console.log("🔗 Association concerts-jours...");
    await pool.query(
      'INSERT INTO concert_days_day ("concertId", "dayId") VALUES ($1, $2)',
      [concert1.rows[0].id, day1.rows[0].id]
    );
    await pool.query(
      'INSERT INTO concert_days_day ("concertId", "dayId") VALUES ($1, $2)',
      [concert2.rows[0].id, day1.rows[0].id]
    );
    await pool.query(
      'INSERT INTO concert_days_day ("concertId", "dayId") VALUES ($1, $2)',
      [concert3.rows[0].id, day2.rows[0].id]
    );

    // 4. Créer des POI de test
    console.log("📍 Création des POI de test...");
    const poi1 = await pool.query(
      `INSERT INTO poi (title, type, latitude, longitude, description, category, address, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING id`,
      [
        "Restaurant Le Bistrot",
        "restaurant",
        48.8566,
        2.3522,
        "Un excellent restaurant français",
        "gastronomie",
        "123 Rue de la Paix, Paris",
      ]
    );
    const poi2 = await pool.query(
      `INSERT INTO poi (title, type, latitude, longitude, description, category, address, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING id`,
      [
        "Bar Le Jazz",
        "bar",
        48.8606,
        2.3376,
        "Bar avec ambiance jazz",
        "divertissement",
        "456 Avenue des Champs-Élysées, Paris",
      ]
    );
    const poi3 = await pool.query(
      `INSERT INTO poi (title, type, latitude, longitude, description, category, address, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING id`,
      [
        "Parking Principal",
        "parking",
        48.8546,
        2.3472,
        "Parking principal du festival",
        "logistique",
        "789 Boulevard Saint-Germain, Paris",
      ]
    );

    console.log(
      `✅ POI créés - IDs: ${poi1.rows[0].id}, ${poi2.rows[0].id}, ${poi3.rows[0].id}`
    );

    console.log("\n🎉 Données de test ajoutées avec succès !");
    console.log("📊 Résumé des données créées :");
    console.log(
      `📅 Jours: ${day1.rows[0].id}, ${day2.rows[0].id}, ${day3.rows[0].id}`
    );
    console.log(
      `🎵 Concerts: ${concert1.rows[0].id}, ${concert2.rows[0].id}, ${concert3.rows[0].id}`
    );
    console.log(
      `📍 POI: ${poi1.rows[0].id}, ${poi2.rows[0].id}, ${poi3.rows[0].id}`
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des données de test:", error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
seedTestData();
