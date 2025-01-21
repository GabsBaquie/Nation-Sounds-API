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
  await AppDataSource.initialize();
  if (process.env.NODE_ENV === 'test') {
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.query(`DROP TABLE IF EXISTS ${entity.tableName};`);
    }

    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
    await AppDataSource.synchronize();
  }
};

/**
 * Ferme la connexion à la base de données après les tests.
 */
export const closeTestDB = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
};

/**
 * Crée un utilisateur admin par défaut pour les tests.
 * @returns Le token JWT de l'administrateur.
 */
export const createAdminUser = async (): Promise<string> => {
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