import express from "express";
const router = express.Router();

// Route de test pour l'authentification
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working!" });
});

export default router;
