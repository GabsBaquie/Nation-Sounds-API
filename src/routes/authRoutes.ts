// src/routes/authRoutes.ts
import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer les informations du profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", authMiddleware, AuthController.getProfile);

/**
 * @swagger
 * /api/auth/reset-password-request:
 *   post:
 *     summary: Demander la réinitialisation du mot de passe
 */
router.post("/reset-password-request", AuthController.requestPasswordReset);

/**
 * @swagger
 * /api/auth/reset-password:
 *   put:
 *     summary: Réinitialiser le mot de passe
 */
router.put("/reset-password", AuthController.resetPassword);

/**
 * Route pour changer le mot de passe (authentification requise)
 */
router.put("/change-password", authMiddleware, AuthController.changePassword);

export default router;
