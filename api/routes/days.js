const express = require("express");
const router = express.Router();

// Route de test pour les jours
router.get("/", (req, res) => {
  res.json({ message: "Days routes working!" });
});

module.exports = router;
