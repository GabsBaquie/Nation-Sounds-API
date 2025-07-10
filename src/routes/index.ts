// src/routes/index.ts
import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Concert } from "../entity/Concert";
import { Day } from "../entity/Day";
import { POI } from "../entity/POI";
import { SecurityInfo } from "../entity/SecurityInfo";
import { adminMiddleware, authMiddleware } from "../middleware";
import adminRoutes from "./adminRoutes";
import authRoutes from "./authRoutes";
import concertRoutes from "./concertRoutes";
import dayRoutes from "./dayRoutes";
import poiRoutes from "./poiRoutes";
import securityInfoRoutes from "./securityInfoRoutes";
import uploadRoutes from "./uploadRoutes";

const router = Router();

router.use("/auth", authRoutes, authMiddleware);
router.use("/pois", poiRoutes);
router.use("/days", dayRoutes);
router.use("/concerts", concertRoutes);
router.use("/upload", uploadRoutes);
router.use("/admin", adminRoutes, authMiddleware, adminMiddleware);
router.use("/securityInfos", securityInfoRoutes);

// Route pour récupérer toutes les données
router.get("/", async (req, res) => {
  try {
    const data = {
      days: await AppDataSource.getRepository(Day).find({
        relations: ["concerts"],
      }),
      concerts: await AppDataSource.getRepository(Concert).find({
        relations: ["days"],
      }),
      pois: await AppDataSource.getRepository(POI).find(),
      securityInfos: await AppDataSource.getRepository(SecurityInfo).find(),
    };
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
