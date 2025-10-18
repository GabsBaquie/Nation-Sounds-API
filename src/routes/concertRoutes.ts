// src/routes/concertRoutes.ts
import { Router } from "express";
import ConcertController from "../controllers/ConcertController";
import { CreateConcertDto } from "../dto/requests/create-concert.dto";
import { checkJwt } from "../middleware/checkJwt";
import { validateDto } from "../middleware/validateDto";

const router = Router();

/**
 * @swagger
 * /api/concerts:
 *   get:
 *     summary: Obtenir tous les concerts
 */
router.get("/", ConcertController.getAll);

/**
 * @swagger
 * /api/concerts/{id}:
 *   get:
 *     summary: Obtenir un concert par ID
 */
router.get("/:id", ConcertController.getById);

/**
 * @swagger
 * /api/concerts:
 *   post:
 *     summary: Créer un nouveau concert
 */
router.post(
  "/",
  [checkJwt, validateDto(CreateConcertDto)],
  ConcertController.create
);

/**
 * @swagger
 * /api/concerts/{id}:
 *   put:
 *     summary: Mettre à jour un concert
 */
router.put(
  "/:id",
  [checkJwt, validateDto(CreateConcertDto)],
  ConcertController.update
);

/**
 * @swagger
 * /api/concerts/{id}:
 *   delete:
 *     summary: Supprimer un concert
 */
router.delete("/:id", [checkJwt], ConcertController.delete);

export default router;
