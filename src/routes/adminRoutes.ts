// src/routes/adminRoutes.ts
import { Router } from "express";
import AdminController from "../controllers/AdminController";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Route protégée pour créer un utilisateur (accessible uniquement aux admins)
router.post(
  "/users",
  authMiddleware,
  adminMiddleware,
  AdminController.createUser
);

// Route protégée pour obtenir tous les utilisateurs (accessible uniquement aux admins)
router.get("/users", authMiddleware, adminMiddleware, AdminController.getUsers);

export default router;
