const { Pool } = require("pg");

// Configuration de la base de données
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:oSDtMiPZ3ij7RVnC@db.dtvryosgiqnwcfceazcj.supabase.co:5432/postgres",
});

async function cleanAndSeed() {
  try {
    console.log("🧹 Nettoyage des tables...");

    // Supprimer toutes les données existantes
    await pool.query("DELETE FROM concert_days_day");
    await pool.query("DELETE FROM concert");
    await pool.query("DELETE FROM day");
    await pool.query("DELETE FROM poi");
    await pool.query("DELETE FROM security_info");

    console.log("✅ Tables nettoyées !");

    // Réinitialiser les séquences
    console.log("🔄 Réinitialisation des séquences...");
    await pool.query("ALTER SEQUENCE concert_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE day_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE poi_id_seq RESTART WITH 1");
    await pool.query("ALTER SEQUENCE security_info_id_seq RESTART WITH 1");

    console.log("🌱 Création des données de test avec IDs prévisibles...");

    // 1. Créer des jours avec IDs 1, 2, 3
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

    // 2. Créer des concerts avec IDs 1, 2, 3
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

    // 4. Créer des POI avec IDs 1, 2, 3
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

    // 5. Créer des Security Info avec IDs 1, 2, 3
    const security1 = await pool.query(
      `INSERT INTO security_info (title, description, urgence, actif, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id`,
      [
        "Alerte Sécurité - Évacuation",
        "En cas d'urgence, suivez les panneaux d'évacuation vers les sorties de secours. Restez calme et suivez les instructions du personnel de sécurité.",
        true,
        true,
      ]
    );
    const security2 = await pool.query(
      `INSERT INTO security_info (title, description, urgence, actif, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id`,
      [
        "Règles de Sécurité Générales",
        "Interdiction de fumer dans les zones couvertes. Les objets dangereux sont interdits. En cas de problème, contactez immédiatement le personnel de sécurité.",
        false,
        true,
      ]
    );
    const security3 = await pool.query(
      `INSERT INTO security_info (title, description, urgence, actif, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id`,
      [
        "Premiers Secours",
        "Poste de secours situé près de l'entrée principale. Numéro d'urgence : 112. En cas de blessure, alertez immédiatement le personnel.",
        false,
        true,
      ]
    );

    console.log(
      `✅ Security Info créés - IDs: ${security1.rows[0].id}, ${security2.rows[0].id}, ${security3.rows[0].id}`
    );

    console.log("\n🎉 Données de test créées avec IDs prévisibles !");
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
    console.log(
      `🛡️ Security Info: ${security1.rows[0].id}, ${security2.rows[0].id}, ${security3.rows[0].id}`
    );
  } catch (error) {
    console.error("❌ Erreur lors de la création des données:", error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
cleanAndSeed();
