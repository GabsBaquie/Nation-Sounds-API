const express = require("express");
const router = express.Router();

// Route de test pour l'upload
router.get("/", (req, res) => {
  res.json({ message: "Upload routes working!" });
});

module.exports = router;
