#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration de la base de données
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    "postgresql://postgres:oSDtMiPZ3ij7RVnC@db.dtvryosgiqnwcfceazcj.supabase.co:5432/postgres",
});

async function resetAndSeed() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Nettoyage de la base de données...');
    
    // Lire et exécuter le script de nettoyage
    const cleanPath = path.join(__dirname, 'clean-database.sql');
    const cleanSQL = fs.readFileSync(cleanPath, 'utf8');
    await client.query(cleanSQL);
    
    console.log('✅ Base de données nettoyée !');
    
    console.log('🌱 Ajout des données de seed...');
    
    // Lire et exécuter le script de seed
    const seedPath = path.join(__dirname, 'seed-global-data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSQL);
    
    console.log('✅ Données de seed ajoutées !');
    
    // Vérifier les données finales
    const result = await client.query(`
      SELECT 'Partenaires' as table_name, COUNT(*) as count FROM partenaire
      UNION ALL
      SELECT 'Actualités', COUNT(*) FROM actualite
      UNION ALL
      SELECT 'Jours', COUNT(*) FROM day
      UNION ALL
      SELECT 'Concerts', COUNT(*) FROM concert
      UNION ALL
      SELECT 'POI', COUNT(*) FROM poi
      UNION ALL
      SELECT 'Infos sécurité', COUNT(*) FROM security_info
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Données finales :');
    result.rows.forEach(row => {
      console.log(`  ${row.table_name}: ${row.count} entrées`);
    });
    
    console.log('\n🎉 Reset et seed terminés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du reset et seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  resetAndSeed()
    .then(() => {
      console.log('🎉 Processus terminé !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { resetAndSeed };
