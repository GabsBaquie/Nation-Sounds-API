// src/routes/programRoutes.ts
import { Router } from "express";
import ProgramController from "../controllers/ProgramController";
import { checkJwt } from "../middleware/checkJwt";

const router = Router();

/**
 * @swagger
 * /api/programs:
 *   get:
 *     summary: Obtenir tous les programmes
 */
router.get("/", ProgramController.getAll);

/**
 * @swagger
 * /api/programs/{id}:
 *   get:
 *     summary: Obtenir un programme par ID
 */
router.get("/:id", ProgramController.getById);

/**
 * @swagger
 * /api/programs:
 *   post:
 *     summary: Créer un nouveau programme
 */
router.post("/", [checkJwt], ProgramController.create);

/**
 * @swagger
 * /api/programs/{id}:
 *   put:
 *     summary: Mettre à jour un programme
 */
router.put("/:id", [checkJwt], ProgramController.update);

/**
 * @swagger
 * /api/programs/{id}:
 *   delete:
 *     summary: Supprimer un programme
 */
router.delete("/:id", [checkJwt], ProgramController.delete);

export default router;
