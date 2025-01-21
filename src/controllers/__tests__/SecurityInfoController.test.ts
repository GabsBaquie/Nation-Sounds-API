import request from 'supertest';
import { AppDataSource } from '../../data-source';
import app from '../../index';
import { SecurityInfo } from '../../entity/SecurityInfo';

beforeAll(async () => {
  await AppDataSource.initialize();

  if (process.env.NODE_ENV === 'test') {
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0;'); // Désactiver les clés étrangères
    const entities = AppDataSource.entityMetadatas;

    // Supprimer les données des tables
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.query(`DROP TABLE IF EXISTS ${entity.tableName};`);
    }

    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1;'); // Réactiver les clés étrangères
    await AppDataSource.synchronize(); // Recréer les tables
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy(); // Fermer la connexion après les tests
  }
});

describe('SecurityInfo API', () => {
  it('créer une nouvelle information de sécurité', async () => {
    const res = await request(app)
      .post('/api/securityInfos')
      .send({
        title: 'Test Sécurité',
        description: 'Description de test',
        urgence: false,
        actif: true,
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Sécurité');
  });

  it('récupérer toutes les informations de sécurité', async () => {
    const res = await request(app).get('/api/securityInfos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('récupérer une information de sécurité par ID', async () => {
    const securityInfo = await AppDataSource.getRepository(SecurityInfo).save({
      title: 'Info Par ID',
      description: 'Description par ID',
      urgence: true,
      actif: true,
    });

    const res = await request(app).get(`/api/securityInfos/${securityInfo.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Info Par ID');
  });

  it('mettre à jour une information de sécurité', async () => {
    const securityInfo = await AppDataSource.getRepository(SecurityInfo).save({
      title: 'Info à Mettre à Jour',
      description: 'Description initiale',
      urgence: false,
      actif: true,
    });

    const res = await request(app)
      .put(`/api/securityInfos/${securityInfo.id}`)
      .send({
        title: 'Info Mise à Jour',
        description: 'Description mise à jour',
        urgence: true,
        actif: false,
      });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Info Mise à Jour');
  });

  it('supprimer une information de sécurité', async () => {
    const securityInfo = await AppDataSource.getRepository(SecurityInfo).save({
      title: 'Info à Supprimer',
      description: 'Description à supprimer',
      urgence: false,
      actif: false,
    });

    const res = await request(app).delete(`/api/securityInfos/${securityInfo.id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(
      'Information de sécurité supprimée avec succès'
    );
  });
});