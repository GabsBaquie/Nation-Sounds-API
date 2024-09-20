// src/routes/notificationRoutes.ts
import { Router } from "express";
import NotificationController from "../controllers/NotificationController";
import { checkJwt } from "../middleware/checkJwt";

const router = Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtenir toutes les notifications
 */
router.get("/", NotificationController.getAll);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Créer une nouvelle notification
 */
router.post("/", [checkJwt], NotificationController.create);

export default router;
