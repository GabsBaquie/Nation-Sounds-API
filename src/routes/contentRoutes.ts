// src/routes/contentRoutes.ts

import { Router } from "express";
import ContentController from "../controllers/ContentController";

const router = Router();

// Routes pour /api/contents
router.get("/", ContentController.getAll);
router.get("/:id", ContentController.getById);
router.post("/", ContentController.create);
router.put("/:id", ContentController.update);
router.delete("/:id", ContentController.delete);

export default router;
