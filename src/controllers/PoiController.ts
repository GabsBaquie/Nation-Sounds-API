// src/controllers/PoiController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CreatePoiDto } from "../dto/create-poi.dto";
import { POI } from "../entity/POI";

class PoiController {
  static async getAll(req: Request, res: Response) {
    const poiRepository = AppDataSource.getRepository(POI);
    const type = req.query.type as string;

    let pois;
    if (type) {
      pois = await poiRepository.find({ where: { type } });
    } else {
      pois = await poiRepository.find();
    }

    res.json(pois);
  }

  static async getById(req: Request, res: Response) {
    const poiRepository = AppDataSource.getRepository(POI);
    const id = parseInt(req.params.id);

    try {
      const poi = await poiRepository.findOneOrFail({ where: { id } });
      res.json(poi);
    } catch (error) {
      res.status(404).json({ message: "Point d’intérêt non trouvé" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const dto = req.dto as CreatePoiDto;
      const poi = AppDataSource.getRepository(POI).create({
        ...dto,
        description: dto.description ?? "",
      });
      const saved = await AppDataSource.getRepository(POI).save(poi);
      return res.status(201).json(saved);
    } catch (error) {
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // Ajout de la méthode update pour PUT /api/pois/:id
  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const dto = req.dto as CreatePoiDto;
      const poiRepository = AppDataSource.getRepository(POI);
      const poi = await poiRepository.findOne({ where: { id } });
      if (!poi) {
        return res.status(404).json({ message: "POI non trouvé" });
      }
      poi.title = dto.title;
      poi.type = dto.type;
      poi.latitude = dto.latitude;
      poi.longitude = dto.longitude;
      poi.description = dto.description ?? "";
      poi.category = dto.category;
      poi.address = dto.address;
      const saved = await poiRepository.save(poi);
      return res.status(200).json(saved);
    } catch (error) {
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const poiRepository = AppDataSource.getRepository(POI);
      const poi = await poiRepository.findOne({ where: { id } });
      if (!poi) {
        return res.status(404).json({ message: "POI non trouvé" });
      }
      await poiRepository.remove(poi);
      return res.status(200).json({ message: "POI supprimé avec succès" });
    } catch (error) {
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }
}

export default PoiController;
