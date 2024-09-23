// src/controllers/ConcertController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Concert } from "../entity/Concert";
import { validate } from "class-validator";

class ConcertController {
  // GET /api/concerts
  static async getAll(req: Request, res: Response) {
    try {
      const concertRepository = AppDataSource.getRepository(Concert);
      const concerts = await concertRepository.find({ relations: ["day"] });
      return res.status(200).json(concerts);
    } catch (error) {
      console.error("Erreur lors de la récupération des concerts:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // GET /api/concerts/:id
  static async getById(req: Request, res: Response) {
    const concertId = parseInt(req.params.id);

    try {
      const concertRepository = AppDataSource.getRepository(Concert);
      const concert = await concertRepository.findOne({
        where: { id: concertId },
        relations: ["day"],
      });

      if (!concert) {
        return res.status(404).json({ message: "Concert non trouvé" });
      }

      return res.status(200).json(concert);
    } catch (error) {
      console.error("Erreur lors de la récupération du concert:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // POST /api/concerts
  static async create(req: Request, res: Response) {
    try {
      const concertRepository = AppDataSource.getRepository(Concert);
      const { name, description, performer, time, location, day } = req.body;

      const concert = concertRepository.create({
        name,
        description,
        performer,
        time,
        location,
        day,
      });

      const errors = await validate(concert);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      await concertRepository.save(concert);
      return res.status(201).json(concert);
    } catch (error) {
      console.error("Erreur lors de la création du concert:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // PUT /api/concerts/:id
  static async update(req: Request, res: Response) {
    const concertId = parseInt(req.params.id);

    try {
      const concertRepository = AppDataSource.getRepository(Concert);
      let concert = await concertRepository.findOne({
        where: { id: concertId },
        relations: ["day"],
      });

      if (!concert) {
        return res.status(404).json({ message: "Concert non trouvé" });
      }

      concertRepository.merge(concert, req.body);
      const errors = await validate(concert);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const results = await concertRepository.save(concert);
      return res.status(200).json(results);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du concert:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // DELETE /api/concerts/:id
  static async delete(req: Request, res: Response) {
    const concertId = parseInt(req.params.id);

    try {
      const concertRepository = AppDataSource.getRepository(Concert);
      const result = await concertRepository.delete(concertId);

      if (result.affected === 1) {
        return res
          .status(200)
          .json({ message: "Concert supprimé avec succès" });
      } else {
        return res.status(404).json({ message: "Concert non trouvé" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du concert:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default ConcertController;
