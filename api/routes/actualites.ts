import express from "express";
const router = express.Router();

// Route de test pour les actualités
router.get("/", (req, res) => {
  res.json({ message: "Actualites routes working!" });
});

export default router;
