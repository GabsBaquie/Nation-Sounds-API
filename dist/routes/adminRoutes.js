"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/adminRoutes.ts
const express_1 = require("express");
const AdminController_1 = __importDefault(require("../controllers/AdminController"));
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// Route protégée pour créer un utilisateur
router.post("/users", middleware_1.authMiddleware, middleware_1.adminMiddleware, (0, middleware_1.roleMiddleware)(["admin"]), AdminController_1.default.createUser);
// route pour récupérer tous les utilisateurs
router.get("/users", middleware_1.authMiddleware, middleware_1.adminMiddleware, (0, middleware_1.roleMiddleware)(["admin"]), AdminController_1.default.getUsers);
// Route pour récupérer un utilisateur spécifique par ID
router.get("/users/:id", middleware_1.authMiddleware, middleware_1.adminMiddleware, (0, middleware_1.roleMiddleware)(["admin"]), AdminController_1.default.getUserById);
// Route pour mettre à jour un utilisateur spécifique par ID
router.put("/users/:id", middleware_1.authMiddleware, middleware_1.adminMiddleware, (0, middleware_1.roleMiddleware)(["admin"]), AdminController_1.default.updateUser);
// Route pour supprimer un utilisateur par ID
router.delete("/users/:id", middleware_1.authMiddleware, middleware_1.adminMiddleware, (0, middleware_1.roleMiddleware)(["admin"]), AdminController_1.default.deleteUser);
exports.default = router;
