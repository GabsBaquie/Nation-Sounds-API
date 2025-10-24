import express from "express";
const router = express.Router();

// Route de test pour l'upload
router.get("/", (req, res) => {
  res.json({ message: "Upload routes working!" });
});

export default router;
