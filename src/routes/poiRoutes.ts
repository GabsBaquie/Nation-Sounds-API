// src/routes/poiRoutes.ts
import { Router } from "express";
import PoiController from "../controllers/PoiController";
import { CreatePoiDto } from "../dto/requests/create-poi.dto";
import { validateDto } from "../middleware/validateDto";

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
 * /api/pois:
 *   post:
 *     summary: Créer un point d'intérêt
 */
router.post("/", validateDto(CreatePoiDto), PoiController.create);

/**
 * @swagger
 * /api/pois/{id}:
 *   get:
 *     summary: Obtenir un point d'intérêt par ID
 */
router.get("/:id", PoiController.getById);

// Ajout de la route PUT pour la mise à jour d'un POI
router.put("/:id", validateDto(CreatePoiDto), PoiController.update);

router.delete("/:id", PoiController.delete);

export default router;
