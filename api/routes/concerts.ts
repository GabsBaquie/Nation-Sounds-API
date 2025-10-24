import express from "express";
const router = express.Router();

// Route de test pour les concerts
router.get("/", (req, res) => {
  res.json({ message: "Concerts routes working!" });
});

export default router;
