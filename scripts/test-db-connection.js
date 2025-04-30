// Script pour tester la connexion à la base de données MySQL
require('dotenv').config({ path: '.env.test' });
const mysql = require('mysql2/promise');

console.log('Tentative de connexion à la base de données de test...');
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
    await connection.execute('SELECT 1 + 1 AS test');
    console.log('✅ Requête SQL exécutée avec succès !');
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:');
    console.error(error);
  }
}

testConnection(); 