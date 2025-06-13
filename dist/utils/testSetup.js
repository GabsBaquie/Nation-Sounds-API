"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUser = exports.closeTestDB = exports.initializeTestDB = void 0;
// src/utils/testSetup.ts
const supertest_1 = __importDefault(require("supertest"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = __importDefault(require("../index"));
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
/**
 * Initialise la connexion à la base de données pour les tests.
 */
const initializeTestDB = () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield data_source_1.AppDataSource.initialize();
        console.log('Connexion à la base de données de test réussie !');
        if (process.env.NODE_ENV === 'test') {
            console.log('Réinitialisation de la base de données de test...');
            yield data_source_1.AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
            const entities = data_source_1.AppDataSource.entityMetadatas;
            for (const entity of entities) {
                const repository = data_source_1.AppDataSource.getRepository(entity.name);
                yield repository.query(`DROP TABLE IF EXISTS ${entity.tableName};`);
            }
            yield data_source_1.AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
            yield data_source_1.AppDataSource.synchronize();
            console.log('Base de données de test réinitialisée avec succès.');
        }
    }
    catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données de test:', error);
        // En environnement de déploiement, ne pas faire échouer les tests
        if (process.env.HEROKU || process.env.RAILWAY) {
            console.log('Environnement de déploiement détecté. Les tests ne seront pas bloquants.');
            return;
        }
        throw error;
    }
});
exports.initializeTestDB = initializeTestDB;
/**
 * Ferme la connexion à la base de données après les tests.
 */
const closeTestDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Ignorer si nous sommes en environnement de production ou si les tests doivent être ignorés
    if (process.env.NODE_ENV === 'production' || process.env.SKIP_TESTS === 'true') {
        return;
    }
    try {
        if (data_source_1.AppDataSource.isInitialized) {
            console.log('Fermeture de la connexion à la base de données de test...');
            yield data_source_1.AppDataSource.destroy();
            console.log('Connexion à la base de données de test fermée avec succès.');
        }
    }
    catch (error) {
        console.error('Erreur lors de la fermeture de la connexion à la base de données de test:', error);
    }
});
exports.closeTestDB = closeTestDB;
/**
 * Crée un utilisateur admin par défaut pour les tests.
 * @returns Le token JWT de l'administrateur.
 */
const createAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    // Mock si nous sommes en environnement de production ou si les tests doivent être ignorés
    if (process.env.NODE_ENV === 'production' || process.env.SKIP_TESTS === 'true') {
        return 'mock-token-for-production';
    }
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    // Vérifie si l'utilisateur admin existe déjà
    const existingAdmin = yield userRepository.findOne({ where: { email: 'admin@example.com' } });
    if (!existingAdmin) {
        const hashedPassword = yield bcrypt_1.default.hash('adminPass123', 10);
        const adminUser = userRepository.create({
            username: 'adminuser',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });
        yield userRepository.save(adminUser);
    }
    // Se connecter en tant qu'admin pour obtenir le token
    const res = yield (0, supertest_1.default)(index_1.default)
        .post('/api/auth/login')
        .send({
        email: 'admin@example.com',
        password: 'adminPass123',
    });
    return res.body.token;
});
exports.createAdminUser = createAdminUser;
