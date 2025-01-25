// src/controllers/DayController.ts

import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Day } from '../entity/Day';
import { Concert } from '../entity/Concert';

class DayController {
  // GET /api/days
  static async getAll(req: Request, res: Response) {
    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const days = await dayRepository.find({
        relations: ['concerts'],
      });
      return res.status(200).json(days);
    } catch (error) {
      console.error('Erreur lors de la récupération des jours:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // GET /api/days/:id
  static async getById(req: Request, res: Response) {
    const dayId = parseInt(req.params.id);

    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const day = await dayRepository.findOne({
        where: { id: dayId },
        relations: ['concerts'],
      });

      if (!day) {
        return res.status(404).json({ message: 'Jour non trouvé' });
      }

      return res.status(200).json(day);
    } catch (error) {
      console.error('Erreur lors de la récupération du jour:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // POST /api/days
  static async create(req: Request, res: Response) {
    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const concertRepository = AppDataSource.getRepository(Concert);
      
      const { title, date, concertIds } = req.body; // Utilisez 'concertIds' pour recevoir les IDs des concerts

      // Récupérer les concerts depuis la base de données
      const concerts = await concertRepository.findByIds(concertIds);

      if (concerts.length !== concertIds.length) {
        return res.status(404).json({ message: "Un ou plusieurs concerts n'ont pas été trouvés." });
      }

      // Créer le nouveau jour avec les concerts associés
      const day = dayRepository.create({ title, date, concerts });

      // Valider les données
      const errors = await validate(day);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      // Enregistrer le jour dans la base de données
      await dayRepository.save(day);
      return res.status(201).json(day);
    } catch (error) {
      console.error('Erreur lors de la création du jour avec concerts:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // PUT /api/days/:id
  static async update(req: Request, res: Response) {
    const dayId = parseInt(req.params.id, 10);
    const { title, date, concertIds } = req.body; // Ajout de 'concertIds' optionnel

    if (isNaN(dayId)) {
      return res.status(400).json({ message: "ID de jour invalide" });
    }

    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const concertRepository = AppDataSource.getRepository(Concert);

      // Récupérer le jour avec ses concerts actuels
      const day = await dayRepository.findOne({
        where: { id: dayId },
        relations: ['concerts'],
      });

      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      // Mettre à jour les propriétés du jour
      if (title !== undefined) day.title = title;
      if (date !== undefined) day.date = date;

      // Si 'concertIds' est fourni, ajouter les concerts
      if (concertIds) {
        if (!Array.isArray(concertIds)) {
          return res.status(400).json({ message: "Les IDs des concerts doivent être un tableau." });
        }

        // Récupérer les concerts depuis la base de données
        const concertsToAdd = await concertRepository.findByIds(concertIds);

        if (concertsToAdd.length !== concertIds.length) {
          return res.status(404).json({ message: "Un ou plusieurs concerts n'ont pas été trouvés." });
        }

        // Éviter les doublons
        const existingConcertIds = day.concerts.map(concert => concert.id);
        const newConcerts = concertsToAdd.filter(concert => !existingConcertIds.includes(concert.id));

        // Ajouter les nouveaux concerts
        day.concerts = [...day.concerts, ...newConcerts];
      }

      // Valider les données
      const errors = await validate(day);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      // Enregistrer les modifications
      await dayRepository.save(day);
      return res.status(200).json(day);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du jour:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // DELETE /api/days/:id
  static async delete(req: Request, res: Response) {
    const dayId = parseInt(req.params.id, 10);

    if (isNaN(dayId)) {
      return res.status(400).json({ message: "ID de jour invalide" });
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const dayRepository = queryRunner.manager.getRepository(Day);
      const concertRepository = queryRunner.manager.getRepository(Concert);

      // Récupérer le Day avec ses concerts
      const day = await dayRepository.findOne({
        where: { id: dayId },
        relations: ["concerts"],
      });

      if (!day) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      // Détacher les concerts associés
      day.concerts = [];
      await dayRepository.save(day);

      // Maintenant, supprimer le Day
      const deleteResult = await dayRepository.delete(dayId);

      if (deleteResult.affected === 1) {
        await queryRunner.commitTransaction();
        return res.status(200).json({ message: "Jour supprimé avec succès" });
      } else {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({ message: "Jour non trouvé" });
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Erreur lors de la suppression du jour:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Ajouter des concerts à un Day
   * PUT /api/days/:id/concerts
   */
  static async addConcerts(req: Request, res: Response) {
    const dayId = parseInt(req.params.id, 10);
    const { concertIds } = req.body; // expecting array of concert IDs

    if (isNaN(dayId)) {
      return res.status(400).json({ message: "ID de jour invalide" });
    }

    if (!Array.isArray(concertIds) || concertIds.some(id => isNaN(parseInt(id, 10)))) {
      return res.status(400).json({ message: "Liste d'IDs de concerts invalide" });
    }

    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const concertRepository = AppDataSource.getRepository(Concert);

      const day = await dayRepository.findOne({
        where: { id: dayId },
        relations: ['concerts'],
      });

      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      const concerts = await concertRepository.findByIds(concertIds);

      if (concerts.length !== concertIds.length) {
        return res.status(404).json({ message: "Un ou plusieurs concerts non trouvés" });
      }

      day.concerts = [...day.concerts, ...concerts];

      await dayRepository.save(day);

      return res.status(200).json(day);
    } catch (error) {
      console.error("Erreur lors de l'ajout de concerts au jour:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default DayController;
