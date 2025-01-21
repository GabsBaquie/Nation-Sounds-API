"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/login:
 *
 * parameters:
 *  email: ""
 *  password: ""
 *
 *   post:
 *     summary: Connecter un utilisateur
 */
router.post("/login", AuthController_1.default.login);
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer les informations du profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", authMiddleware_1.authMiddleware, AuthController_1.default.getProfile);
/**
 * @swagger
 * /api/auth/reset-password-request:
 *   post:
 *     summary: Demander la réinitialisation du mot de passe
 */
router.post("/reset-password-request", AuthController_1.default.requestPasswordReset);
/**
 * @swagger
 * /api/auth/reset-password:
 *   put:
 *     summary: Réinitialiser le mot de passe
 */
router.put("/reset-password", AuthController_1.default.resetPassword);
/**
 * Route pour changer le mot de passe (authentification requise)
 */
router.put("/change-password", authMiddleware_1.authMiddleware, AuthController_1.default.changePassword);
exports.default = router;
