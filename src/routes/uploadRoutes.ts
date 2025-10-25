import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadImage } from "../middleware/uploadImage";
import { ImageService } from "../services/ImageService";
import { SupabaseStorageService } from "../services/SupabaseStorage";

const router = Router();

router.post(
  "/image",
  authMiddleware,
  uploadImage.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier envoyé" });
    }

    try {
      const filename = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${req.file.originalname.split(".").pop()}`;

      // Extraire le token d'authentification depuis les headers
      const authToken = req.headers.authorization?.replace("Bearer ", "");

      const result = await SupabaseStorageService.uploadImage(
        req.file.buffer,
        filename,
        req.file.mimetype,
        authToken
      );

      if (result.success) {
        console.log("Image uploadée avec succès:", result.url);
        res.status(201).json({ image: result.url });
      } else {
        console.error("Erreur lors de l'upload:", result.error);
        res.status(500).json({ message: "Erreur lors de l'upload de l'image" });
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      res.status(500).json({ message: "Erreur lors de l'upload de l'image" });
    }
  }
);

router.get("/list", async (req, res) => {
  try {
    const result = await SupabaseStorageService.listImages();
    if (result.success) {
      res.json(result.images);
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des images:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des images" });
  }
});

// Supprimer une image
router.delete("/image/:filename", authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    // Extraire le token d'authentification depuis les headers
    const authToken = req.headers.authorization?.replace("Bearer ", "");

    const result = await SupabaseStorageService.deleteImage(
      filename,
      authToken
    );

    if (result.success) {
      res.json({ message: "Image supprimée avec succès", filename });
    } else {
      res.status(500).json({ message: result.error });
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
