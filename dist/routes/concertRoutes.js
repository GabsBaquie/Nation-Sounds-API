"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/concertRoutes.ts
const express_1 = require("express");
const ConcertController_1 = __importDefault(require("../controllers/ConcertController"));
const checkJwt_1 = require("../middleware/checkJwt");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/concerts:
 *   get:
 *     summary: Obtenir tous les concerts
 */
router.get("/", ConcertController_1.default.getAll);
/**
 * @swagger
 * /api/concerts/{id}:
 *   get:
 *     summary: Obtenir un concert par ID
 */
router.get("/:id", ConcertController_1.default.getById);
/**
 * @swagger
 * /api/concerts:
 *   post:
 *     summary: Créer un nouveau concert
 */
router.post("/", [checkJwt_1.checkJwt], ConcertController_1.default.create);
/**
 * @swagger
 * /api/concerts/{id}:
 *   put:
 *     summary: Mettre à jour un concert
 */
router.put("/:id", [checkJwt_1.checkJwt], ConcertController_1.default.update);
/**
 * @swagger
 * /api/concerts/{id}:
 *   delete:
 *     summary: Supprimer un concert
 */
router.delete("/:id", [checkJwt_1.checkJwt], ConcertController_1.default.delete);
exports.default = router;
