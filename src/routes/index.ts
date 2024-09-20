// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./authRoutes";
import notificationRoutes from "./notificationRoutes";
import poiRoutes from "./poiRoutes";
import programRoutes from "./programRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/notifications", notificationRoutes);
router.use("/pois", poiRoutes);
router.use("/programs", programRoutes);

export default router;
