"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/poiRoutes.ts
const express_1 = require("express");
const PoiController_1 = __importDefault(require("../controllers/PoiController"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/pois:
 *   get:
 *     summary: Obtenir tous les points d'intérêt
 */
router.get("/", PoiController_1.default.getAll);
/**
 * @swagger
 * /api/pois:
 *   post:
 *     summary: Créer un point d'intérêt
 */
router.post("/", PoiController_1.default.create);
/**
 * @swagger
 * /api/pois/{id}:
 *   get:
 *     summary: Obtenir un point d'intérêt par ID
 */
router.get("/:id", PoiController_1.default.getById);
exports.default = router;
