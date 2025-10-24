import { Request, Response } from "express";
import {
  CreatePartenaireDto,
  UpdatePartenaireDto,
} from "../dto/requests/partenaire.dto";
import { PartenaireService } from "../services/PartenaireService";

export class PartenaireController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const partenaires = await PartenaireService.findAll();
      res.json(partenaires);
    } catch (error) {
      console.error("Erreur lors de la récupération des partenaires:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des partenaires",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  static async getAllAdmin(req: Request, res: Response): Promise<void> {
    try {
      const partenaires = await PartenaireService.findAllAdmin();
      res.json(partenaires);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des partenaires (admin):",
        error
      );
      res.status(500).json({
        message: "Erreur lors de la récupération des partenaires",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "ID invalide" });
        return;
      }

      const partenaire = await PartenaireService.findById(id);
      if (!partenaire) {
        res.status(404).json({ message: "Partenaire non trouvé" });
        return;
      }

      res.json(partenaire);
    } catch (error) {
      console.error("Erreur lors de la récupération du partenaire:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération du partenaire",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreatePartenaireDto = (req as any).dto;
      const partenaire = await PartenaireService.create(dto);
      res.status(201).json(partenaire);
    } catch (error) {
      console.error("Erreur lors de la création du partenaire:", error);
      res.status(500).json({
        message: "Erreur lors de la création du partenaire",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "ID invalide" });
        return;
      }

      const dto: UpdatePartenaireDto = (req as any).dto;
      const partenaire = await PartenaireService.update(id, dto);

      if (!partenaire) {
        res.status(404).json({ message: "Partenaire non trouvé" });
        return;
      }

      res.json(partenaire);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du partenaire:", error);
      res.status(500).json({
        message: "Erreur lors de la mise à jour du partenaire",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "ID invalide" });
        return;
      }

      const deleted = await PartenaireService.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Partenaire non trouvé" });
        return;
      }

      res.json({ message: "Partenaire supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression du partenaire:", error);
      res.status(500).json({
        message: "Erreur lors de la suppression du partenaire",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  static async toggleActive(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "ID invalide" });
        return;
      }

      const partenaire = await PartenaireService.toggleActive(id);
      if (!partenaire) {
        res.status(404).json({ message: "Partenaire non trouvé" });
        return;
      }

      res.json(partenaire);
    } catch (error) {
      console.error(
        "Erreur lors du basculement du statut du partenaire:",
        error
      );
      res.status(500).json({
        message: "Erreur lors du basculement du statut du partenaire",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }
}
