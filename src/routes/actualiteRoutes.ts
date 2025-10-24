import { Router } from "express";
import { ActualiteController } from "../controllers/ActualiteController";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  validateCreateActualite,
  validateUpdateActualite,
} from "../middleware/validateActualite";

const router = Router();

// Routes publiques
router.get("/", ActualiteController.getAll);
router.get("/:id", ActualiteController.getById);

// Routes protégées (admin)
router.get("/admin/all", authMiddleware, ActualiteController.getAllAdmin);
router.post(
  "/",
  authMiddleware,
  validateCreateActualite,
  ActualiteController.create
);
router.put(
  "/:id",
  authMiddleware,
  validateUpdateActualite,
  ActualiteController.update
);
router.delete("/:id", authMiddleware, ActualiteController.delete);
router.patch("/:id/toggle", authMiddleware, ActualiteController.toggleActive);

export default router;
