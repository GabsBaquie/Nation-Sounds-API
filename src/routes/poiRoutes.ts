// src/routes/poiRoutes.ts
import { Router } from "express";
import PoiController from "../controllers/PoiController";

const router = Router();

/**
 * @swagger
 * /api/pois:
 *   get:
 *     summary: Obtenir tous les points d'intérêt
 */
router.get("/", PoiController.getAll);

/**
 * @swagger
 * /api/pois/{id}:
 *   get:
 *     summary: Obtenir un point d'intérêt par ID
 */
router.get("/:id", PoiController.getById);

export default router;
