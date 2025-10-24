import express from "express";
const router = express.Router();

// Route de test pour les statistiques
router.get("/", (req, res) => {
  res.json({ message: "Stats routes working!" });
});

export default router;
