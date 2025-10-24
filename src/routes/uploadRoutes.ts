import { Router } from "express";
import { uploadImage } from "../middleware/uploadImage";
import { ImageService } from "../services/ImageService";

const router = Router();

router.post("/image", uploadImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier envoyé" });
  }
  // Retourne l’URL publique (à adapter selon ton domaine)
  const image = `/upload/image/${req.file.filename}`;
  console.log("Réponse envoyée au frontend :", { image });
  res.status(201).json({ image });
});

router.get("/list", async (req, res) => {
  try {
    const images = await ImageService.getAllImages();
    res.json(images);
  } catch (error) {
    console.error("Erreur lors de la récupération des images:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des images" });
  }
});

// Supprimer une image
router.delete("/image/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const result = await ImageService.deleteImage(filename);

    if (result.success) {
      res.json({ message: result.message, filename });
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'image" });
  }
});

// Renommer une image
router.put("/image/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ message: "Nouveau nom requis" });
    }

    const result = await ImageService.renameImage(filename, newName);

    if (result.success) {
      res.json({
        message: result.message,
        oldName: filename,
        newName: newName,
        newPath: result.newPath,
      });
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error("Erreur lors du renommage de l'image:", error);
    res.status(500).json({ message: "Erreur lors du renommage de l'image" });
  }
});

// Statistiques des images
router.get("/stats", async (req, res) => {
  try {
    const stats = await ImageService.getImageStats();
    res.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des statistiques" });
  }
});

export default router;
