import { Router } from "express";
import fs from "fs";
import path from "path";
import { uploadImage } from "../middleware/uploadImage";

const router = Router();

router.post("/image", uploadImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier envoyé" });
  }
  // Retourne l’URL publique (à adapter selon ton domaine)
  const image = `/uploads/images/${req.file.filename}`;
  console.log("Réponse envoyée au frontend :", { image });
  res.status(201).json({ image });
});

router.get("/list", (req, res) => {
  const imagesDir = path.join(__dirname, "../../uploads/images");
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la lecture du dossier images" });
    }
    const images = files.map((file) => `/uploads/images/${file}`);
    res.json(images);
  });
});

export default router;
