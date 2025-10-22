#!/usr/bin/env node

const { Pool } = require("pg");
require("dotenv").config({ path: ".env.test" });

async function checkSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("🔍 Vérification du schéma de la base de données...");

    // Vérifier les tables existantes
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("📋 Tables existantes:");
    tablesResult.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });

    // Vérifier la structure de la table 'day'
    if (tablesResult.rows.some((row) => row.table_name === "day")) {
      console.log('\n📊 Structure de la table "day":');
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'day' 
        ORDER BY ordinal_position;
      `);

      columnsResult.rows.forEach((col) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} (${
            col.is_nullable === "YES" ? "nullable" : "not null"
          })`
        );
      });
    } else {
      console.log('❌ Table "day" n\'existe pas!');
    }

    // Vérifier la structure de la table 'concert'
    if (tablesResult.rows.some((row) => row.table_name === "concert")) {
      console.log('\n📊 Structure de la table "concert":');
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'concert' 
        ORDER BY ordinal_position;
      `);

      columnsResult.rows.forEach((col) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} (${
            col.is_nullable === "YES" ? "nullable" : "not null"
          })`
        );
      });
    } else {
      console.log('❌ Table "concert" n\'existe pas!');
    }

    // Tester une insertion simple
    console.log('\n🧪 Test d\'insertion dans la table "day"...');
    try {
      const insertResult = await pool.query(
        `
        INSERT INTO day (title, date) 
        VALUES ($1, $2) 
        RETURNING id, title, date;
      `,
        ["Test Day", new Date()]
      );

      console.log("✅ Insertion réussie:", insertResult.rows[0]);

      // Nettoyer
      await pool.query("DELETE FROM day WHERE id = $1", [
        insertResult.rows[0].id,
      ]);
      console.log("🧹 Test nettoyé");
    } catch (insertError) {
      console.error("❌ Erreur lors de l'insertion:", insertError.message);
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
