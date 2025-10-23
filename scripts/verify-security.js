const { Pool } = require("pg");
require("dotenv").config();

async function verifySecurity() {
  console.log("🔍 Vérification de la sécurité Supabase...\n");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();

    // 1. Vérifier les vues sans SECURITY DEFINER
    console.log("📊 Vérification des vues :");
    const viewsResult = await client.query(`
      SELECT schemaname, viewname, definition
      FROM pg_views 
      WHERE schemaname = 'public' 
      AND viewname IN (
        'public_data', 'full_db', 'db_stats', 'poi_stats_by_type',
        'concerts_by_month', 'security_info_stats', 'user_stats_by_role',
        'recent_activity', 'concerts_with_days', 'days_with_concerts'
      )
    `);

    viewsResult.rows.forEach((row) => {
      const hasSecurityDefiner = row.definition.includes("SECURITY DEFINER");
      console.log(
        `${hasSecurityDefiner ? "❌" : "✅"} ${row.viewname}: ${
          hasSecurityDefiner ? "SECURITY DEFINER détecté" : "Sécurisé"
        }`
      );
    });

    // 2. Vérifier RLS sur les tables
    console.log("\n🔐 Vérification RLS :");
    const rlsResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        rowsecurity as rls_enabled
      FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename IN ('user', 'concert', 'day', 'poi', 'security_info', 'concert_days_day')
    `);

    rlsResult.rows.forEach((row) => {
      console.log(
        `${row.rls_enabled ? "✅" : "❌"} ${row.tablename}: RLS ${
          row.rls_enabled ? "activé" : "désactivé"
        }`
      );
    });

    // 3. Vérifier les politiques RLS
    console.log("\n🛡️ Vérification des politiques RLS :");
    const policiesResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname
    `);

    if (policiesResult.rows.length > 0) {
      policiesResult.rows.forEach((row) => {
        const roles = Array.isArray(row.roles)
          ? row.roles.join(", ")
          : row.roles;
        console.log(
          `✅ ${row.tablename}.${row.policyname}: ${row.cmd} (${roles})`
        );
      });
    } else {
      console.log("❌ Aucune politique RLS trouvée");
    }

    // 4. Test des vues
    console.log("\n🧪 Test des vues :");
    const testViews = [
      "public_data",
      "db_stats",
      "poi_stats_by_type",
      "concerts_by_month",
      "security_info_stats",
      "recent_activity",
      "concerts_with_days",
      "days_with_concerts",
    ];

    for (const viewName of testViews) {
      try {
        const result = await client.query(
          `SELECT COUNT(*) as count FROM ${viewName}`
        );
        console.log(`✅ ${viewName}: ${result.rows[0].count} enregistrements`);
      } catch (error) {
        console.log(`❌ ${viewName}: ${error.message}`);
      }
    }

    // 5. Vérifier les permissions
    console.log("\n🔑 Vérification des permissions :");
    const permissionsResult = await client.query(`
      SELECT 
        table_name,
        privilege_type,
        grantee
      FROM information_schema.table_privileges 
      WHERE table_schema = 'public'
      AND table_name IN (
        'public_data', 'full_db', 'db_stats', 'poi_stats_by_type',
        'concerts_by_month', 'security_info_stats', 'user_stats_by_role',
        'recent_activity', 'concerts_with_days', 'days_with_concerts'
      )
      ORDER BY table_name, grantee
    `);

    if (permissionsResult.rows.length > 0) {
      permissionsResult.rows.forEach((row) => {
        console.log(
          `✅ ${row.table_name}: ${row.privilege_type} pour ${row.grantee}`
        );
      });
    } else {
      console.log("❌ Aucune permission trouvée");
    }

    client.release();
    console.log("\n🎉 Vérification terminée !");
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifySecurity();
