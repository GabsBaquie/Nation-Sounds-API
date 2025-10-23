import { Request, Response } from "express";
import { CreateActualiteDto } from "../dto/requests/create-actualite.dto";
import { UpdateActualiteDto } from "../dto/requests/update-actualite.dto";
import { ActualiteService } from "../services/ActualiteService";

export class ActualiteController {
  // GET /api/actualites - Récupérer toutes les actualités actives
  static async getAll(req: Request, res: Response) {
    try {
      const actualites = await ActualiteService.findAll();
      return res.json(actualites);
    } catch (error) {
      console.error("Erreur lors de la récupération des actualités:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  // GET /api/actualites/admin - Récupérer toutes les actualités (admin)
  static async getAllAdmin(req: Request, res: Response) {
    try {
      const actualites = await ActualiteService.findAllAdmin();
      return res.json(actualites);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des actualités admin:",
        error
      );
      return res.status(500).json({
        message: "Erreur serveur",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  // GET /api/actualites/:id - Récupérer une actualité par ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const actualite = await ActualiteService.findById(parseInt(id));

      if (!actualite) {
        return res.status(404).json({ message: "Actualité non trouvée" });
      }

      return res.json(actualite);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'actualité:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  // POST /api/actualites - Créer une nouvelle actualité
  static async create(req: Request, res: Response) {
    try {
      const dto = (req as any).dto as CreateActualiteDto;
      const actualite = await ActualiteService.create(dto);
      return res.status(201).json(actualite);
    } catch (error) {
      console.error("Erreur lors de la création de l'actualité:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  // PUT /api/actualites/:id - Mettre à jour une actualité
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = (req as any).dto as UpdateActualiteDto;
      dto.id = parseInt(id);

      const actualite = await ActualiteService.update(parseInt(id), dto);

      if (!actualite) {
        return res.status(404).json({ message: "Actualité non trouvée" });
      }

      return res.json(actualite);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'actualité:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  // DELETE /api/actualites/:id - Supprimer une actualité
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await ActualiteService.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({ message: "Actualité non trouvée" });
      }

      return res.json({ message: "Actualité supprimée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'actualité:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  // PATCH /api/actualites/:id/toggle - Activer/Désactiver une actualité
  static async toggleActive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const actualite = await ActualiteService.toggleActive(parseInt(id));

      if (!actualite) {
        return res.status(404).json({ message: "Actualité non trouvée" });
      }

      return res.json(actualite);
    } catch (error) {
      console.error(
        "Erreur lors du changement de statut de l'actualité:",
        error
      );
      return res.status(500).json({
        message: "Erreur serveur",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }
}
