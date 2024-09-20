// src/routes/authRoutes.ts
import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 */
router.post("/login", AuthController.login);

export default router;
