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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// src/controllers/AuthController.ts
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const uuid_1 = require("uuid");
const emailService_1 = require("../utils/emailService");
const typeorm_1 = require("typeorm");
class AuthController {
    // Connexion de l'utilisateur
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            // Validation des données
            if (!email || !password) {
                return res.status(400).json({ message: "Email et mot de passe requis" });
            }
            try {
                const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
                const user = yield userRepository.findOne({ where: { email } });
                if (!user) {
                    return res
                        .status(401)
                        .json({ message: "Email ou mot de passe invalide" });
                }
                const isPasswordValid = yield bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res
                        .status(401)
                        .json({ message: "Email ou mot de passe invalide" });
                }
                // Génération du JWT
                const token = jwt.sign({
                    userId: user.id,
                    role: user.role,
                    name: user.username,
                    mail: user.email,
                }, process.env.JWT_SECRET, { expiresIn: "1d" });
                // Définition du cookie
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "none",
                    path: "/",
                    maxAge: 24 * 60 * 60 * 1000, // 1 jour
                });
                return res.status(200).json({
                    message: "Connexion réussie",
                    token: token,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    },
                });
            }
            catch (error) {
                console.error("Erreur lors de la connexion :", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    // Récupérer les informations du profil de l'utilisateur connecté
    static getProfile(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
            try {
                // Trouver l'utilisateur connecté à partir de l'ID stocké dans `req.user`
                const user = yield userRepository.findOne({
                    where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                // Retourner les informations de l'utilisateur
                return res.status(200).json({
                    username: user.username,
                    email: user.email,
                    role: user.role,
                });
            }
            catch (error) {
                console.error("Erreur lors de la récupération du profil :", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    // Changer le mot de passe de l'utilisateur connecté
    static changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.id; // Assurez-vous que l'utilisateur est authentifié et que son ID est disponible
            try {
                const user = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: { id: userId },
                });
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                // Vérifier l'ancien mot de passe
                const isMatch = yield bcrypt.compare(oldPassword, user.password);
                if (!isMatch) {
                    return res
                        .status(400)
                        .json({ message: "Ancien mot de passe incorrect" });
                }
                // Hash du nouveau mot de passe
                const hashedPassword = yield bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
                yield data_source_1.AppDataSource.getRepository(User_1.User).save(user);
                return res
                    .status(200)
                    .json({ message: "Mot de passe changé avec succès" });
            }
            catch (error) {
                console.error("Erreur lors du changement de mot de passe :", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    // Demande de réinitialisation du mot de passe
    static requestPasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: { email },
                });
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                // Générer un jeton unique pour la réinitialisation
                const resetToken = (0, uuid_1.v4)();
                user.resetToken = resetToken;
                user.resetTokenExpiration = new Date(Date.now() + 3600000); // Expire dans 1 heure
                yield data_source_1.AppDataSource.getRepository(User_1.User).save(user);
                // Envoyer un email avec le lien de réinitialisation
                const resetLink = `https://admin-frontend-omega.vercel.app/reset-password/${resetToken}`;
                yield (0, emailService_1.sendResetEmail)(user.email, resetLink);
                return res
                    .status(200)
                    .json({ message: "Email de réinitialisation envoyé" });
            }
            catch (error) {
                console.error("Erreur lors de la demande de réinitialisation:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    // Réinitialisation du mot de passe
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, newPassword } = req.body;
            try {
                const user = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: {
                        resetToken: token,
                        resetTokenExpiration: (0, typeorm_1.MoreThan)(new Date()),
                    },
                });
                if (!user) {
                    return res.status(400).json({ message: "Jeton invalide ou expiré" });
                }
                // Mettre à jour le mot de passe et supprimer le jeton de réinitialisation
                const hashedPassword = yield bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
                user.resetToken = null;
                user.resetTokenExpiration = null;
                yield data_source_1.AppDataSource.getRepository(User_1.User).save(user);
                return res
                    .status(200)
                    .json({ message: "Mot de passe réinitialisé avec succès" });
            }
            catch (error) {
                console.error("Erreur lors de la réinitialisation du mot de passe:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
}
exports.default = AuthController;
