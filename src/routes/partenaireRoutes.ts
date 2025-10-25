import { Router } from "express";
import { PartenaireController } from "../controllers/PartenaireController";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  validateCreatePartenaire,
  validateUpdatePartenaire,
} from "../middleware/validatePartenaire";

const router = Router();

// Routes publiques
router.get("/", PartenaireController.getAll);
router.get("/:id", PartenaireController.getById);

// Routes protégées (admin)
router.get("/admin/all", authMiddleware, PartenaireController.getAllAdmin);
router.post(
  "/",
  authMiddleware,
  validateCreatePartenaire,
  PartenaireController.create
);
router.put(
  "/:id",
  authMiddleware,
  validateUpdatePartenaire,
  PartenaireController.update
);
router.delete("/:id", authMiddleware, PartenaireController.delete);
router.patch("/:id/toggle", authMiddleware, PartenaireController.toggleActive);

export default router;
