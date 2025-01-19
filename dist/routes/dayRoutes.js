"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/dayRoutes.ts
const express_1 = require("express");
const DayController_1 = __importDefault(require("../controllers/DayController"));
const checkJwt_1 = require("../middleware/checkJwt");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/days:
 *   get:
 *     summary: Obtenir tous les jours
 */
router.get("/", DayController_1.default.getAll);
/**
 * @swagger
 * /api/days/{id}:
 *   get:
 *     summary: Obtenir un jour par ID
 */
router.get("/:id", DayController_1.default.getById);
/**
 * @swagger
 * /api/days:
 *   post:
 *     summary: Créer un nouveau jour
 */
router.post("/", [checkJwt_1.checkJwt], DayController_1.default.create);
/**
 * @swagger
 * /api/days/{id}:
 *   put:
 *     summary: Mettre à jour un jour
 */
router.put("/:id", [checkJwt_1.checkJwt], DayController_1.default.update);
/**
 * @swagger
 * /api/days/{id}:
 *   delete:
 *     summary: Supprimer un jour
 */
router.delete("/:id", [checkJwt_1.checkJwt], DayController_1.default.delete);
exports.default = router;
