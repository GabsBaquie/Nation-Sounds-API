// Script pour tester la connexion à la base de données Railway
require('dotenv').config({ path: '.env.test' });
const mysql = require('mysql2/promise');

console.log('Tentative de connexion à la base de données Railway...');
console.log(`URL configurée: ${process.env.TEST_JAWSDB_MARIA_URL ? 'Oui' : 'Non'}`);

// Extraire les informations de connexion de l'URL
const url = new URL(process.env.TEST_JAWSDB_MARIA_URL);
const config = {
  host: url.hostname,
  port: url.port || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.substring(1),
};

console.log('Informations de connexion:');
console.log(`- Hôte: ${config.host}`);
console.log(`- Port: ${config.port}`);
console.log(`- Utilisateur: ${config.user}`);
console.log(`- Base de données: ${config.database}`);

async function testConnection() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connexion réussie à la base de données de test !');
    
    // Tester la création d'une table de test
    console.log('Création d\'une table de test...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS test_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table créée avec succès !');
    
    // Insérer une donnée de test
    console.log('Insertion de données de test...');
    const [result] = await connection.execute(`
      INSERT INTO test_table (name) VALUES ('Test depuis Railway')
    `);
    console.log(`✅ Insertion réussie ! ID: ${result.insertId}`);
    
    // Requête pour vérifier que les données sont bien insérées
    const [rows] = await connection.execute('SELECT * FROM test_table');
    console.log('✅ Données récupérées avec succès :');
    console.log(rows);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:');
    console.error(error);
  }
}

testConnection(); 