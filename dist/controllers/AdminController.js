"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/controllers/AdminController.ts
const bcrypt = __importStar(require("bcrypt"));
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
class AdminController {
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
            const { username, email, password, role } = req.body;
            // Validation des données
            if (!username || !email || !password || !role) {
                return res.status(400).json({ message: "Tous les champs sont requis" });
            }
            // Vérifier que l'email est une adresse Gmail
            if (!email.endsWith("@gmail.com")) {
                return res
                    .status(400)
                    .json({ message: "Seules les adresses Gmail sont autorisées." });
            }
            // Vérifier si l'email ou le username existe déjà
            const userExists = yield userRepository.findOne({
                where: [{ email }, { username }],
            });
            if (userExists) {
                if (userExists.email === email) {
                    return res.status(409).json({ message: "Email déjà utilisé" });
                }
                if (userExists.username === username) {
                    return res
                        .status(409)
                        .json({ message: "Nom d'utilisateur déjà utilisé" });
                }
            }
            // Hachage du mot de passe
            const hashedPassword = yield bcrypt.hash(password, 10);
            // Création de l'utilisateur
            const newUser = userRepository.create({
                username,
                email,
                password: hashedPassword,
                role,
            });
            try {
                yield userRepository.save(newUser);
                return res.status(201).json({ message: "Utilisateur créé avec succès" });
            }
            catch (e) {
                console.error("Erreur lors de la création de l'utilisateur :", e);
                return res
                    .status(500)
                    .json({ message: "Erreur lors de la création de l’utilisateur" });
            }
        });
    }
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { username, email, role } = req.body;
            // Vérification de l'ID avant conversion
            console.log("ID reçu :", id);
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
            try {
                const user = yield userRepository.findOneBy({ id: parseInt(id) });
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                // Log des données avant modification
                console.log("Utilisateur avant modification :", user);
                console.log("Données reçues :", { username, email, role });
                // Validation pour s'assurer que l'email est un Gmail (si l'email est fourni pour la mise à jour)
                if (email && !email.endsWith("@gmail.com")) {
                    return res
                        .status(400)
                        .json({ message: "Seules les adresses Gmail sont autorisées." });
                }
                // Mise à jour des champs si présents
                user.username = username || user.username;
                user.email = email || user.email;
                user.role = role || user.role;
                // Log après modification mais avant enregistrement
                console.log("Utilisateur après modification :", user);
                yield userRepository.save(user);
                // Log après enregistrement
                console.log("Utilisateur sauvegardé :", user);
                return res.status(200).json(user);
            }
            catch (error) {
                console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
            try {
                const user = yield userRepository.findOneBy({ id: parseInt(id) });
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                yield userRepository.remove(user);
                return res
                    .status(200)
                    .json({ message: "Utilisateur supprimé avec succès" });
            }
            catch (error) {
                console.error("Erreur lors de la suppression de l'utilisateur :", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    static getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
                const users = yield userRepository.find();
                return res.status(200).json(users);
            }
            catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
                return res
                    .status(500)
                    .json({ message: "Erreur lors de la récupération des utilisateurs" });
            }
        });
    }
    static getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const user = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: { id: parseInt(userId) },
                });
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                return res.status(200).json(user);
            }
            catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
}
exports.default = AdminController;
