const { Pool } = require("pg");

// Configuration de la base de données
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:oSDtMiPZ3ij7RVnC@db.dtvryosgiqnwcfceazcj.supabase.co:5432/postgres",
});

async function seedGlobalData() {
  try {
    console.log("🧹 Nettoyage des données existantes...");

    // Supprimer toutes les données dans l'ordre correct (en respectant les contraintes de clés étrangères)
    console.log("🗑️ Suppression des données existantes...");

    await pool.query("DELETE FROM concert_days_day");
    console.log("✅ Relations concerts-jours supprimées");

    await pool.query("DELETE FROM actualite");
    console.log("✅ Actualités supprimées");

    try {
      await pool.query("DELETE FROM securityinfo");
      console.log("✅ Informations de sécurité supprimées");
    } catch (error) {
      console.log("⚠️ Table securityinfo n'existe pas, ignorée");
    }

    await pool.query("DELETE FROM poi");
    console.log("✅ POI supprimés");

    await pool.query("DELETE FROM concert");
    console.log("✅ Concerts supprimés");

    await pool.query("DELETE FROM day");
    console.log("✅ Jours supprimés");

    console.log("\n🌱 Ajout des nouvelles données complètes...");

    // 1. Créer des jours avec images
    console.log("📅 Création des jours avec images...");
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

    // 2. Créer des concerts avec images
    console.log("🎵 Création des concerts avec images...");
    const concert1 = await pool.query(
      `INSERT INTO concert (title, description, performer, time, location, image, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Rock Festival 2024",
        "Un festival de rock incroyable avec les meilleurs groupes",
        "The Rock Band",
        "20:00",
        "Scène principale",
        "/images/concerts/rock-festival.jpg",
      ]
    );
    const concert2 = await pool.query(
      `INSERT INTO concert (title, description, performer, time, location, image, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Jazz Night",
        "Soirée jazz élégante avec des musiciens de renom",
        "Jazz Masters",
        "21:30",
        "Scène jazz",
        "/images/concerts/jazz-night.jpg",
      ]
    );
    const concert3 = await pool.query(
      `INSERT INTO concert (title, description, performer, time, location, image, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Electronic Music",
        "Musique électronique moderne et innovante",
        "DJ Electro",
        "22:00",
        "Scène électronique",
        "/images/concerts/electronic.jpg",
      ]
    );
    const concert4 = await pool.query(
      `INSERT INTO concert (title, description, performer, time, location, image, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Acoustic Session",
        "Session acoustique intimiste",
        "Acoustic Duo",
        "19:00",
        "Scène acoustique",
        "/images/concerts/acoustic.jpg",
      ]
    );

    console.log(
      `✅ Concerts créés - IDs: ${concert1.rows[0].id}, ${concert2.rows[0].id}, ${concert3.rows[0].id}, ${concert4.rows[0].id}`
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
    await pool.query(
      'INSERT INTO concert_days_day ("concertId", "dayId") VALUES ($1, $2)',
      [concert4.rows[0].id, day3.rows[0].id]
    );

    // 4. Créer des POI avec images
    console.log("📍 Création des POI avec images...");
    const poi1 = await pool.query(
      `INSERT INTO poi (title, type, latitude, longitude, description, category, address, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING id`,
      [
        "Restaurant Le Bistrot",
        "restaurant",
        48.8566,
        2.3522,
        "Un excellent restaurant français avec terrasse",
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
        "Bar avec ambiance jazz et cocktails",
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
        "Parking principal du festival - 500 places",
        "logistique",
        "789 Boulevard Saint-Germain, Paris",
      ]
    );
    const poi4 = await pool.query(
      `INSERT INTO poi (title, type, latitude, longitude, description, category, address, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING id`,
      [
        "Boutique Officielle",
        "shop",
        48.8586,
        2.3442,
        "Boutique officielle du festival",
        "commerce",
        "321 Rue de Rivoli, Paris",
      ]
    );

    console.log(
      `✅ POI créés - IDs: ${poi1.rows[0].id}, ${poi2.rows[0].id}, ${poi3.rows[0].id}, ${poi4.rows[0].id}`
    );

    // 5. Créer des actualités complètes
    console.log("📰 Création des actualités...");
    const actualite1 = await pool.query(
      `INSERT INTO actualite (title, description, text, image, importance, actif, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Accès & Transport",
        "Toutes les informations pour venir au festival en toute sécurité",
        "Accès facile en train, bus et voiture. Stationnement gratuit disponible à proximité. Navettes gratuites depuis la gare.",
        "/images/actualites/transport.jpg",
        "Très important",
        true,
      ]
    );
    const actualite2 = await pool.query(
      `INSERT INTO actualite (title, description, text, image, importance, actif, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Restauration",
        "Découvrez nos stands et foodtrucks pour tous les goûts",
        "Une offre variée pour tous les goûts : cuisine française, internationale, végétarienne et vegan.",
        "/images/actualites/restauration.jpg",
        "Important",
        true,
      ]
    );
    const actualite3 = await pool.query(
      `INSERT INTO actualite (title, description, text, image, importance, actif, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Nouvelle scène",
        "Une nouvelle scène a été ajoutée cette année",
        "Venez découvrir la nouvelle scène découverte avec des artistes émergents et des performances inédites.",
        "/images/actualites/nouvelle-scene.jpg",
        "Important",
        true,
      ]
    );
    const actualite4 = await pool.query(
      `INSERT INTO actualite (title, description, text, image, importance, actif, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Objets trouvés",
        "Un espace dédié pour retrouver vos objets",
        "Rendez-vous à l'accueil du festival pour récupérer vos objets perdus. Service disponible 24h/24.",
        "/images/actualites/objets-trouves.jpg",
        "Modéré",
        true,
      ]
    );
    const actualite5 = await pool.query(
      `INSERT INTO actualite (title, description, text, image, importance, actif, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Parking gratuit",
        "Parking gratuit disponible à proximité",
        "Un parking de 500 places est disponible gratuitement à 5 minutes du festival. Accès direct par navette.",
        "/images/actualites/parking.jpg",
        "Important",
        true,
      ]
    );
    const actualite6 = await pool.query(
      `INSERT INTO actualite (title, description, text, image, importance, actif, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING id`,
      [
        "Météo du weekend",
        "Prévisions météorologiques pour le festival",
        "Temps ensoleillé prévu pour tout le weekend. Pensez à apporter de la crème solaire et un chapeau !",
        "/images/actualites/meteo.jpg",
        "Modéré",
        true,
      ]
    );

    console.log(
      `✅ Actualités créées - IDs: ${actualite1.rows[0].id}, ${actualite2.rows[0].id}, ${actualite3.rows[0].id}, ${actualite4.rows[0].id}, ${actualite5.rows[0].id}, ${actualite6.rows[0].id}`
    );

    // 6. Informations de sécurité (table non disponible)
    console.log("🛡️ Table securityinfo non disponible, ignorée");

    console.log(
      "\n🎉 Nettoyage et ajout des données complètes terminé avec succès !"
    );
    console.log("📊 Résumé des données créées :");
    console.log(
      `📅 Jours: ${day1.rows[0].id}, ${day2.rows[0].id}, ${day3.rows[0].id}`
    );
    console.log(
      `🎵 Concerts: ${concert1.rows[0].id}, ${concert2.rows[0].id}, ${concert3.rows[0].id}, ${concert4.rows[0].id}`
    );
    console.log(
      `📍 POI: ${poi1.rows[0].id}, ${poi2.rows[0].id}, ${poi3.rows[0].id}, ${poi4.rows[0].id}`
    );
    console.log(
      `📰 Actualités: ${actualite1.rows[0].id}, ${actualite2.rows[0].id}, ${actualite3.rows[0].id}, ${actualite4.rows[0].id}, ${actualite5.rows[0].id}, ${actualite6.rows[0].id}`
    );
    console.log("🛡️ Sécurité: Table non disponible");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage et ajout des données:", error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
seedGlobalData();
