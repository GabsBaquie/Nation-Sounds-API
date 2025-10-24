const express = require("express");
const router = express.Router();

// Route de test pour les infos de sécurité
router.get("/", (req, res) => {
  res.json({ message: "Security Infos routes working!" });
});

module.exports = router;
