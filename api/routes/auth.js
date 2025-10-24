const express = require("express");
const router = express.Router();

// Route de test pour l'authentification
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working!" });
});

module.exports = router;
