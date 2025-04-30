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
    yield data_source_1.AppDataSource.initialize();
    if (process.env.NODE_ENV === 'test') {
        yield data_source_1.AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
        const entities = data_source_1.AppDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = data_source_1.AppDataSource.getRepository(entity.name);
            yield repository.query(`DROP TABLE IF EXISTS ${entity.tableName};`);
        }
        yield data_source_1.AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
        yield data_source_1.AppDataSource.synchronize();
    }
});
exports.initializeTestDB = initializeTestDB;
/**
 * Ferme la connexion à la base de données après les tests.
 */
const closeTestDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (data_source_1.AppDataSource.isInitialized) {
        yield data_source_1.AppDataSource.destroy();
    }
});
exports.closeTestDB = closeTestDB;
/**
 * Crée un utilisateur admin par défaut pour les tests.
 * @returns Le token JWT de l'administrateur.
 */
const createAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
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
