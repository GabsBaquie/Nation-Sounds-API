// src/routes/dayRoutes.ts
import { Router } from "express";
import DayController from "../controllers/DayController";
import { checkJwt } from "../middleware/checkJwt";
import {
  validateCreateDay,
  validateUpdateDay,
} from "../middleware/validateDay";

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
 * /api/days/date-range:
 *   get:
 *     summary: Obtenir les jours par plage de dates
 */
router.get("/date-range", DayController.getByDateRange);

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
router.post("/", [checkJwt, validateCreateDay], DayController.create);

/**
 * @swagger
 * /api/days/{id}/concerts:
 *   put:
 *     summary: Ajouter des concerts à un jour
 */
router.put("/:id/concerts", DayController.addConcerts);

/**
 * @swagger
 * /api/days/{id}:
 *   put:
 *     summary: Mettre à jour un jour
 */
router.put("/:id", [checkJwt, validateUpdateDay], DayController.update);

/**
 * @swagger
 * /api/days/{id}:
 *   delete:
 *     summary: Supprimer un jour
 */
router.delete("/:id", [checkJwt], DayController.delete);

export default router;
