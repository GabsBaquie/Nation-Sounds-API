const express = require("express");
const router = express.Router();

// Route de test pour les statistiques
router.get("/", (req, res) => {
  res.json({ message: "Stats routes working!" });
});

module.exports = router;
