// src/routes/adminRoutes.ts
import { Router } from "express";
import AdminController from "../controllers/AdminController";
import { adminMiddleware, authMiddleware, roleMiddleware } from "../middleware";

const router = Router();

// Route protégée pour créer un utilisateur
router.post(
  "/users/create",
  authMiddleware,
  adminMiddleware,
  roleMiddleware(["admin"]),
  AdminController.createUser
);

// route pour récupérer tous les utilisateurs
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

// Route pour mettre à jour un utilisateur spécifique par ID
router.put(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  roleMiddleware(["admin"]),
  AdminController.updateUser
);

// Route pour supprimer un utilisateur par ID
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  roleMiddleware(["admin"]),
  AdminController.deleteUser
);

export default router;
