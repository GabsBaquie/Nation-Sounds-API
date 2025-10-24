const express = require("express");
const router = express.Router();

// Route de test pour les POI
router.get("/", (req, res) => {
  res.json({ message: "POI routes working!" });
});

module.exports = router;
