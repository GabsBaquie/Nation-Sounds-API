// src/controllers/__tests__/AdminController.test.ts
import request from 'supertest';
import { initializeTestDB, closeTestDB, createAdminUser } from '../../utils/testSetup';
import app from '../../index';
import { User } from '../../entity/User';
import { AppDataSource } from '../../data-source';

describe('AdminController API', () => {
  let adminToken: string;
  let adminUser: User;

  beforeAll(async () => {
    await initializeTestDB();
    adminToken = await createAdminUser();
    adminUser = await AppDataSource.getRepository(User).findOneBy({ email: 'admin@example.com' }) as User;
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('POST /api/admin/users', () => {
    it('devrait créer un nouvel utilisateur avec des données valides', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'testuser',
          email: 'testuser@gmail.com',
          password: 'testPass123',
          role: 'user',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Utilisateur créé avec succès');

      const user = await AppDataSource.getRepository(User).findOneBy({ email: 'testuser@gmail.com' });
      expect(user).toBeDefined();
      expect(user?.username).toBe('testuser');
    });

    it('ne devrait pas créer un utilisateur avec des champs manquants', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'incomplete@gmail.com',
          password: 'testPass123',
          role: 'user',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Tous les champs sont requis');
    });

    it('ne devrait pas créer un utilisateur avec un email non Gmail', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'invalidEmailUser',
          email: 'user@nongmail.com',
          password: 'testPass123',
          role: 'user',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Seules les adresses Gmail sont autorisées.');
    });

    it('ne devrait pas créer un utilisateur avec un email déjà utilisé', async () => {
      // Créer d'abord l'utilisateur
      await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'duplicateEmailUser',
          email: 'duplicate@gmail.com',
          password: 'testPass123',
          role: 'user',
        });

      // Tenter de créer à nouveau avec le même email
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'anotherUser',
          email: 'duplicate@gmail.com',
          password: 'testPass123',
          role: 'user',
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message', 'Email déjà utilisé');
    });

    it('ne devrait pas créer un utilisateur avec un nom d\'utilisateur déjà utilisé', async () => {
      // Créer d'abord l'utilisateur
      await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'duplicateUsername',
          email: 'unique@gmail.com',
          password: 'testPass123',
          role: 'user',
        });

      // Tenter de créer à nouveau avec le même nom d'utilisateur
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'duplicateUsername',
          email: 'anotherunique@gmail.com',
          password: 'testPass123',
          role: 'user',
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message', 'Nom d\'utilisateur déjà utilisé');
    });
  });

  it('devrait récupérer tous les utilisateurs', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('devrait récupérer un utilisateur par ID', async () => {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email: 'testuser@gmail.com' },
    });

    const res = await request(app)
      .get(`/api/admin/users/${user?.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'testuser@gmail.com');
  });

  it('devrait mettre à jour un utilisateur', async () => {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email: 'testuser@gmail.com' },
    });

    const res = await request(app)
      .put(`/api/admin/users/${user?.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'updatedUser',
        email: 'updateduser@gmail.com',
        role: 'admin',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', 'updatedUser');
    expect(res.body).toHaveProperty('role', 'admin');
  });

  it('devrait supprimer un utilisateur', async () => {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email: 'updateduser@gmail.com' },
    });

    const res = await request(app)
      .delete(`/api/admin/users/${user?.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Utilisateur supprimé avec succès');
  });

  it('ne devrait pas permettre de supprimer le dernier administrateur', async () => {
    // Tenter de supprimer le seul administrateur existant
    const res = await request(app)
      .delete(`/api/admin/users/${adminUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Impossible de supprimer le dernier administrateur');
  });
});