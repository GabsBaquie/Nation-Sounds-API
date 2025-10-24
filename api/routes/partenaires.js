const express = require("express");
const router = express.Router();

// Route de test pour les partenaires
router.get("/", (req, res) => {
  res.json({ message: "Partenaires routes working!" });
});

module.exports = router;
