// src/routes/dayRoutes.ts
import { Router } from "express";
import DayController from "../controllers/DayController";
import { checkJwt } from "../middleware/checkJwt";

const router = Router();

/**
 * @swagger
 * /api/days:
 *   get:
 *     summary: Obtenir tous les jours
 */
router.get("/", DayController.getAll);

/**
 * @swagger
 * /api/days/{id}:
 *   get:
 *     summary: Obtenir un jour par ID
 */
router.get("/:id", DayController.getById);

/**
 * @swagger
 * /api/days:
 *   post:
 *     summary: Créer un nouveau jour
 */
router.post("/", [checkJwt], DayController.create);

/**
 * @swagger
 * /api/days/{id}:
 *   put:
 *     summary: Mettre à jour un jour
 */
router.put("/:id", [checkJwt], DayController.update);

/**
 * @swagger
 * /api/days/{id}:
 *   delete:
 *     summary: Supprimer un jour
 */
router.delete("/:id", [checkJwt], DayController.delete);

export default router;
