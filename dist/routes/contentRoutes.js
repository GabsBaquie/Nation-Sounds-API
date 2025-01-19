"use strict";
// src/routes/contentRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContentController_1 = __importDefault(require("../controllers/ContentController"));
const router = (0, express_1.Router)();
// Routes pour /api/contents
router.get("/", ContentController_1.default.getAll);
router.get("/:id", ContentController_1.default.getById);
router.post("/", ContentController_1.default.create);
router.put("/:id", ContentController_1.default.update);
router.delete("/:id", ContentController_1.default.delete);
exports.default = router;
