// src/controllers/PoiController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
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
    const poiRepository = AppDataSource.getRepository(POI);
    const { name, type, latitude, longitude, description } = req.body;

    const poi = poiRepository.create({
      title: name,
      type,
      latitude,
      longitude,
      description
    });

    try {
      await poiRepository.save(poi);
      res.status(201).json(poi);
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la création du point d’intérêt" });
    }
  }
}

export default PoiController;
