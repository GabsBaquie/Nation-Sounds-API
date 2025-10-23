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

// Supprimer une image
router.delete("/image/:filename", (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, "../../uploads/images", filename);

  // Vérifier que le fichier existe
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: "Image non trouvée" });
  }

  // Supprimer le fichier
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Erreur lors de la suppression:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la suppression de l'image" });
    }

    console.log(`Image supprimée: ${filename}`);
    res.json({ message: "Image supprimée avec succès", filename });
  });
});

// Renommer une image
router.put("/image/:filename", (req, res) => {
  const { filename } = req.params;
  const { newName } = req.body;

  if (!newName) {
    return res.status(400).json({ message: "Nouveau nom requis" });
  }

  const oldPath = path.join(__dirname, "../../uploads/images", filename);
  const newPath = path.join(__dirname, "../../uploads/images", newName);

  // Vérifier que le fichier existe
  if (!fs.existsSync(oldPath)) {
    return res.status(404).json({ message: "Image non trouvée" });
  }

  // Vérifier que le nouveau nom n'existe pas déjà
  if (fs.existsSync(newPath)) {
    return res
      .status(409)
      .json({ message: "Une image avec ce nom existe déjà" });
  }

  // Renommer le fichier
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error("Erreur lors du renommage:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors du renommage de l'image" });
    }

    console.log(`Image renommée: ${filename} -> ${newName}`);
    res.json({
      message: "Image renommée avec succès",
      oldName: filename,
      newName: newName,
      newPath: `/uploads/images/${newName}`,
    });
  });
});

export default router;
