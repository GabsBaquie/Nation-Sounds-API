// src/routes/index.ts
import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../middleware";
import { ActualiteService } from "../services/ActualiteService";
import { ConcertService } from "../services/ConcertService";
import { DayService } from "../services/DayService";
import { PartenaireService } from "../services/PartenaireService";
import { PoiService } from "../services/PoiService";
import { SecurityInfoService } from "../services/SecurityInfoService";
import actualiteRoutes from "./actualiteRoutes";
import adminRoutes from "./adminRoutes";
import authRoutes from "./authRoutes";
import concertRoutes from "./concertRoutes";
import dayRoutes from "./dayRoutes";
import partenaireRoutes from "./partenaireRoutes";
import poiRoutes from "./poiRoutes";
import securityInfoRoutes from "./securityInfoRoutes";
import statsRoutes from "./statsRoutes";
import uploadRoutes from "./uploadRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pois", poiRoutes);
router.use("/days", dayRoutes);
router.use("/concerts", concertRoutes);
router.use("/upload", uploadRoutes);
router.use("/admin", adminRoutes, authMiddleware, adminMiddleware);
router.use("/securityInfos", securityInfoRoutes);
router.use("/actualites", actualiteRoutes);
router.use("/partenaires", partenaireRoutes);
router.use("/stats", statsRoutes);

// Route pour récupérer toutes les données
router.get("/", async (req, res) => {
  try {
    console.log("Début de la récupération des données...");
    const data = {
      days: await DayService.findAll(),
      concerts: await ConcertService.findAll(),
      pois: await PoiService.findAll(),
      securityInfos: await SecurityInfoService.findAll(),
      actualites: await ActualiteService.findAll(),
      partenaires: await PartenaireService.findAll(),
    };
    console.log("Données récupérées avec succès");
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: error instanceof Error ? error.message : "Erreur inconnue" 
    });
  }
});

export default router;
