// src/utils/testSetup.ts
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../index';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

/**
 * Initialise la connexion à la base de données pour les tests.
 */
export const initializeTestDB = async () => {
  // Vérifier si nous sommes en environnement de production ou si les tests doivent être ignorés
  if (process.env.NODE_ENV === 'production' || process.env.SKIP_TESTS === 'true') {
    console.log('Tests ignorés en environnement de production.');
    return;
  }

  try {
    console.log('Initialisation de la base de données de test...');
    console.log(`URL de connexion: ${process.env.TEST_JAWSDB_MARIA_URL ? 'Configurée' : 'Manquante'}`);
    
    if (!process.env.TEST_JAWSDB_MARIA_URL) {
      // En environnement de déploiement, ne pas faire échouer les tests s'il n'y a pas de base de données
      if (process.env.HEROKU || process.env.RAILWAY) {
        console.log('Environnement de déploiement détecté. Les tests ne seront pas exécutés.');
        return;
      }
      
      console.error('La variable TEST_JAWSDB_MARIA_URL n\'est pas définie.');
      console.error('Veuillez configurer une base de données de test valide.');
      throw new Error('Configuration de base de données de test manquante');
    }

    await AppDataSource.initialize();
    console.log('Connexion à la base de données de test réussie !');
    
    if (process.env.NODE_ENV === 'test') {
      console.log('Réinitialisation de la base de données de test...');
      await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
      const entities = AppDataSource.entityMetadatas;

      for (const entity of entities) {
        const repository = AppDataSource.getRepository(entity.name);
        await repository.query(`DROP TABLE IF EXISTS ${entity.tableName};`);
      }

      await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
      await AppDataSource.synchronize();
      console.log('Base de données de test réinitialisée avec succès.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données de test:', error);
    // En environnement de déploiement, ne pas faire échouer les tests
    if (process.env.HEROKU || process.env.RAILWAY) {
      console.log('Environnement de déploiement détecté. Les tests ne seront pas bloquants.');
      return;
    }
    throw error;
  }
};

/**
 * Ferme la connexion à la base de données après les tests.
 */
export const closeTestDB = async () => {
  // Ignorer si nous sommes en environnement de production ou si les tests doivent être ignorés
  if (process.env.NODE_ENV === 'production' || process.env.SKIP_TESTS === 'true') {
    return;
  }

  try {
    if (AppDataSource.isInitialized) {
      console.log('Fermeture de la connexion à la base de données de test...');
      await AppDataSource.destroy();
      console.log('Connexion à la base de données de test fermée avec succès.');
    }
  } catch (error) {
    console.error('Erreur lors de la fermeture de la connexion à la base de données de test:', error);
  }
};

/**
 * Crée un utilisateur admin par défaut pour les tests.
 * @returns Le token JWT de l'administrateur.
 */
export const createAdminUser = async (): Promise<string> => {
  // Mock si nous sommes en environnement de production ou si les tests doivent être ignorés
  if (process.env.NODE_ENV === 'production' || process.env.SKIP_TESTS === 'true') {
    return 'mock-token-for-production';
  }

  const userRepository = AppDataSource.getRepository(User);

  // Vérifie si l'utilisateur admin existe déjà
  const existingAdmin = await userRepository.findOne({ where: { email: 'admin@example.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('adminPass123', 10);
    const adminUser = userRepository.create({
      username: 'adminuser',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
    await userRepository.save(adminUser);
  }

  // Se connecter en tant qu'admin pour obtenir le token
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@example.com',
      password: 'adminPass123',
    });

  return res.body.token;
};