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
}

export default PoiController;
