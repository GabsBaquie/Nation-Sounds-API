const { Pool } = require("pg");
require("dotenv").config();

async function fixSecurityDefiner() {
  console.log("🔒 Correction des vues avec SECURITY DEFINER...\n");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();

    // Liste des vues à corriger
    const views = [
      "public_data",
      "full_db",
      "db_stats",
      "poi_stats_by_type",
      "concerts_by_month",
      "security_info_stats",
      "user_stats_by_role",
      "recent_activity",
      "concerts_with_days",
      "days_with_concerts",
    ];

    console.log("🔍 Vérification des vues avec SECURITY DEFINER :\n");

    for (const viewName of views) {
      try {
        // Vérifier si la vue a SECURITY DEFINER
        const result = await client.query(
          `
          SELECT 
            schemaname,
            viewname,
            definition
          FROM pg_views 
          WHERE schemaname = 'public' 
          AND viewname = $1
        `,
          [viewName]
        );

        if (result.rows.length > 0) {
          const definition = result.rows[0].definition;
          const hasSecurityDefiner = definition
            .toLowerCase()
            .includes("security definer");

          if (hasSecurityDefiner) {
            console.log(`❌ ${viewName}: Contient SECURITY DEFINER`);

            // Recréer la vue sans SECURITY DEFINER
            console.log(
              `🔧 Recréation de ${viewName} sans SECURITY DEFINER...`
            );

            // Supprimer la vue existante
            await client.query(`DROP VIEW IF EXISTS ${viewName} CASCADE`);

            // Recréer la vue selon son type
            await recreateView(client, viewName);

            console.log(`✅ ${viewName}: Recréée sans SECURITY DEFINER`);
          } else {
            console.log(`✅ ${viewName}: Pas de SECURITY DEFINER`);
          }
        } else {
          console.log(`⚠️  ${viewName}: Vue non trouvée`);
        }
      } catch (error) {
        console.log(`❌ ${viewName}: Erreur - ${error.message}`);
      }
    }

    console.log("\n🎉 Correction terminée !");
  } catch (error) {
    console.error("❌ Erreur lors de la correction:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function recreateView(client, viewName) {
  const viewDefinitions = {
    public_data: `
      CREATE VIEW public_data AS
      SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
      UNION ALL
      SELECT 'day', row_to_json(d.*) FROM day d
      UNION ALL
      SELECT 'poi', row_to_json(p.*) FROM poi p
      UNION ALL
      SELECT 'security_info', row_to_json(s.*) FROM security_info s
    `,

    full_db: `
      CREATE VIEW full_db AS
      SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
      UNION ALL
      SELECT 'day', row_to_json(d.*) FROM day d
      UNION ALL
      SELECT 'poi', row_to_json(p.*) FROM poi p
      UNION ALL
      SELECT 'security_info', row_to_json(s.*) FROM security_info s
      UNION ALL
      SELECT 'user', row_to_json(u.*) FROM "user" u
    `,

    db_stats: `
      CREATE VIEW db_stats AS
      SELECT 
        'concert' as table_name,
        COUNT(*) as count,
        MAX(created_at) as last_created
      FROM concert
      UNION ALL
      SELECT 'day', COUNT(*), MAX(created_at) FROM day
      UNION ALL
      SELECT 'poi', COUNT(*), MAX(created_at) FROM poi
      UNION ALL
      SELECT 'security_info', COUNT(*), MAX(created_at) FROM security_info
      UNION ALL
      SELECT 'user', COUNT(*), MAX(created_at) FROM "user"
      ORDER BY table_name
    `,

    poi_stats_by_type: `
      CREATE VIEW poi_stats_by_type AS
      SELECT 
        type,
        COUNT(*) as count,
        CAST(AVG(latitude) AS DECIMAL(10,6)) as avg_latitude,
        CAST(AVG(longitude) AS DECIMAL(10,6)) as avg_longitude,
        MIN(created_at) as first_created,
        MAX(created_at) as last_created
      FROM poi
      GROUP BY type
      ORDER BY count DESC
    `,

    concerts_by_month: `
      CREATE VIEW concerts_by_month AS
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM concert
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month DESC
    `,

    security_info_stats: `
      CREATE VIEW security_info_stats AS
      SELECT 
        CASE 
          WHEN urgence = true THEN 'urgent'
          ELSE 'normal'
        END as urgency_level,
        COUNT(*) as count
      FROM security_info
      WHERE actif = true
      GROUP BY urgence
      ORDER BY count DESC
    `,

    user_stats_by_role: `
      CREATE VIEW user_stats_by_role AS
      SELECT 
        role,
        COUNT(*) as count,
        MIN(created_at) as first_created,
        MAX(created_at) as last_created
      FROM "user"
      GROUP BY role
      ORDER BY count DESC
    `,

    recent_activity: `
      CREATE VIEW recent_activity AS
      SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
      WHERE c.created_at >= NOW() - INTERVAL '30 days'
      UNION ALL
      SELECT 'day', row_to_json(d.*) FROM day d
      WHERE d.created_at >= NOW() - INTERVAL '30 days'
      UNION ALL
      SELECT 'poi', row_to_json(p.*) FROM poi p
      WHERE p.created_at >= NOW() - INTERVAL '30 days'
      UNION ALL
      SELECT 'security_info', row_to_json(s.*) FROM security_info s
      WHERE s.created_at >= NOW() - INTERVAL '30 days'
      ORDER BY (data->>'created_at') DESC
    `,

    concerts_with_days: `
      CREATE VIEW concerts_with_days AS
      SELECT 
        c.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', d.id,
              'title', d.title,
              'date', d.date,
              'created_at', d.created_at,
              'updated_at', d.updated_at
            )
          ) FILTER (WHERE d.id IS NOT NULL),
          '[]'::json
        ) as days
      FROM concert c
      LEFT JOIN concert_days_day cdd ON c.id = cdd."concertId"
      LEFT JOIN day d ON cdd."dayId" = d.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `,

    days_with_concerts: `
      CREATE VIEW days_with_concerts AS
      SELECT 
        d.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'title', c.title,
              'description', c.description,
              'performer', c.performer,
              'time', c.time,
              'location', c.location,
              'image', c.image,
              'created_at', c.created_at,
              'updated_at', c.updated_at
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as concerts
      FROM day d
      LEFT JOIN concert_days_day cdd ON d.id = cdd."dayId"
      LEFT JOIN concert c ON cdd."concertId" = c.id
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `,
  };

  const definition = viewDefinitions[viewName];
  if (definition) {
    await client.query(definition);
  } else {
    throw new Error(`Définition non trouvée pour la vue ${viewName}`);
  }
}

fixSecurityDefiner();
