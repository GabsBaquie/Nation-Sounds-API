import express from "express";
import { StatsController } from "../controllers/StatsController";
import { checkJwt } from "../middleware/checkJwt";

const router = express.Router();

// Route racine pour /api/stats/
router.get("/", StatsController.getDatabaseStats);

// Routes publiques (sans authentification)
router.get("/public-data", StatsController.getPublicData);
router.get("/stats", StatsController.getDatabaseStats);
router.get("/poi-stats", StatsController.getPoiStatsByType);
router.get("/concerts-by-month", StatsController.getConcertsByMonth);
router.get("/security-stats", StatsController.getSecurityInfoStats);
router.get("/recent-activity", StatsController.getRecentActivity);
router.get("/concerts-with-days", StatsController.getConcertsWithDays);
router.get("/days-with-concerts", StatsController.getDaysWithConcerts);

// Routes protégées (avec authentification)
router.get("/all-data", [checkJwt], StatsController.getAllData);

export default router;
