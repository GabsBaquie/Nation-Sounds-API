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


export default router;
