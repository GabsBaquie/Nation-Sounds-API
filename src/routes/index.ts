// src/routes/index.ts
import { Router } from "express";
import adminRoutes from "./adminRoutes";
import authRoutes from "./authRoutes";
import notificationRoutes from "./notificationRoutes";
import poiRoutes from "./poiRoutes";
import programRoutes from "./programRoutes";
import contentRoutes from "./contentRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/notifications", notificationRoutes);
router.use("/pois", poiRoutes);
router.use("/programs", programRoutes);
router.use("/admin", adminRoutes);
router.use("/contents", contentRoutes);

export default router;
