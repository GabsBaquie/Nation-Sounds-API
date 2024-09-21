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

// Ajoutez d'autres routes admin ici si nécessaire

export default router;
