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
// src/utils/seed.ts
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Fonction pour créer un utilisateur par défaut si aucun utilisateur n'existe dans la base de données
// Cette fonction est appelée lors de l'exécution de la commande npm run seed
// ! Cette fonction ne doit être utilisée qu'en développement
const createDefaultUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const existingUser = yield userRepository.findOne({ where: { email: "test@example.com" } });
    if (existingUser) {
        console.log("Utilisateur par défaut déjà existant.");
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash("password123", 10);
    const user = userRepository.create({
        username: "testuser",
        email: "test@example.com",
        password: hashedPassword,
        role: "admin", // ou "user" selon vos besoins
    });
    yield userRepository.save(user);
    console.log("Utilisateur par défaut créé avec succès.");
});
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield createDefaultUser();
    process.exit(0);
}))
    .catch((error) => {
    console.error("Erreur lors de la création de l'utilisateur par défaut :", error);
    process.exit(1);
});
