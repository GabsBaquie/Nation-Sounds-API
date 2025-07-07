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
      const concerts = await concertRepository.find({ relations: ["days"] });
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
        relations: ["days"],
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
      console.log('Début création concert avec données:', req.body);
      
      const concertRepository = AppDataSource.getRepository(Concert);
      const { title, description, performer, time, location, image, days = [] } = req.body;

      // Vérification des champs requis
      if (!title || !description || !performer || !time || !location || !image) {
        return res.status(400).json({ 
          message: "Tous les champs sont requis", 
          required: ["title", "description", "performer", "time", "location", "image"] 
        });
      }

      // Création du concert
      const concert = concertRepository.create({
        title,
        description,
        performer,
        time,
        location,
        image,
        days: [] // On initialise avec un tableau vide
      });

      console.log('Concert créé:', concert);

      // Validation
      const errors = await validate(concert);
      if (errors.length > 0) {
        console.error('Erreurs de validation:', errors);
        return res.status(400).json(errors);
      }

      // Sauvegarde
      const savedConcert = await concertRepository.save(concert);
      console.log('Concert sauvegardé avec succès:', savedConcert);

      return res.status(201).json(savedConcert);
    } catch (error) {
      console.error('Erreur détaillée lors de la création du concert:', error);
      return res.status(500).json({ 
        message: 'Erreur serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // PUT /api/concerts/:id
  static async update(req: Request, res: Response) {
    const concertId = parseInt(req.params.id);

    try {
      const concertRepository = AppDataSource.getRepository(Concert);
      let concert = await concertRepository.findOne({
        where: { id: concertId },
        relations: ["days"],
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
