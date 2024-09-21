// src/routes/adminRoutes.ts
import { Router } from "express";
import AdminController from "../controllers/AdminController";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

// Route protégée pour créer un utilisateur (accessible uniquement aux admins)
router.post(
  "/users",
  authMiddleware,
  adminMiddleware,
  roleMiddleware(["admin"]),
  AdminController.createUser
);

// Route protégée pour obtenir tous les utilisateurs (accessible uniquement aux admins)
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  roleMiddleware(["admin"]),
  AdminController.getUsers
);

// Route pour récupérer un utilisateur spécifique par ID
router.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  roleMiddleware(["admin"]),
  AdminController.getUserById
);

// Route pour mettre à jour un utilisateur spécifique par ID (accessible uniquement aux admins)
router.put(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  roleMiddleware(["admin"]),
  AdminController.updateUser
);

export default router;
