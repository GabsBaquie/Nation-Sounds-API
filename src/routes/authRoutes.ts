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

export default router;
