"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/programRoutes.ts
const express_1 = require("express");
const ProgramController_1 = __importDefault(require("../controllers/ProgramController"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/programs:
 *   get:
 *     summary: Obtenir tous les programmes
 */
router.get("/", ProgramController_1.default.getAll);
/**
 * @swagger
 * /api/programs/{id}:
 *   get:
 *     summary: Obtenir un programme par ID
 */
router.get("/:id", ProgramController_1.default.getById);
exports.default = router;
