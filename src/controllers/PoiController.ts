// src/controllers/PoiController.ts
import { Request, Response } from "express";
import { CreatePoiDto } from "../dto/requests/create-poi.dto";
import { PoiService } from "../services/PoiService";
import "../types/express";

class PoiController {
  static async getAll(req: Request, res: Response) {
    try {
      const type = req.query.type as string;
      const pois = await PoiService.findAll(type);
      return res.status(200).json(pois);
    } catch (error) {
      console.error("Erreur lors de la récupération des POIs:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de POI invalide" });
    }

    try {
      const poi = await PoiService.findById(id);
      if (!poi) {
        return res.status(404).json({ message: "Point d'intérêt non trouvé" });
      }
      return res.status(200).json(poi);
    } catch (error) {
      console.error("Erreur lors de la récupération du POI:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const dto = req.dto as CreatePoiDto;
      const poi = await PoiService.create(dto);
      return res.status(201).json(poi);
    } catch (error) {
      console.error("Erreur lors de la création du POI:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de POI invalide" });
    }

    try {
      const dto = req.dto as CreatePoiDto;
      const poi = await PoiService.update(id, dto);
      if (!poi) {
        return res.status(404).json({ message: "POI non trouvé" });
      }
      return res.status(200).json(poi);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du POI:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de POI invalide" });
    }

    try {
      const deleted = await PoiService.delete(id);
      if (deleted) {
        return res.status(200).json({ message: "POI supprimé avec succès" });
      } else {
        return res.status(404).json({ message: "POI non trouvé" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du POI:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }
}

export default PoiController;
