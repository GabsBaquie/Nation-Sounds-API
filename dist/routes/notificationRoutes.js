"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/notificationRoutes.ts
const express_1 = require("express");
const NotificationController_1 = __importDefault(require("../controllers/NotificationController"));
const checkJwt_1 = require("../middleware/checkJwt");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtenir toutes les notifications
 */
router.get("/", NotificationController_1.default.getAll);
/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Créer une nouvelle notification
 */
router.post("/", [checkJwt_1.checkJwt], NotificationController_1.default.create);
exports.default = router;
