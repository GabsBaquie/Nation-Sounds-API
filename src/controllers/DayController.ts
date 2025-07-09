// src/controllers/DayController.ts

import { Request, Response } from "express";
import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { CreateDayDto } from "../dto/create-day.dto";
import { Concert } from "../entity/Concert";
import { Day } from "../entity/Day";

class DayController {
  // GET /api/days
  static async getAll(req: Request, res: Response) {
    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const days = await dayRepository.find({
        relations: ["concerts"],
      });
      return res.status(200).json(days);
    } catch (error) {
      console.error("Erreur lors de la récupération des jours:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // GET /api/days/:id
  static async getById(req: Request, res: Response) {
    const dayId = parseInt(req.params.id);

    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const day = await dayRepository.findOne({
        where: { id: dayId },
        relations: ["concerts"],
      });

      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      return res.status(200).json(day);
    } catch (error) {
      console.error("Erreur lors de la récupération du jour:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // POST /api/days
  static async create(req: Request, res: Response) {
    try {
      const dto = req.dto as CreateDayDto;
      const dayRepository = AppDataSource.getRepository(Day);
      const concertRepository = AppDataSource.getRepository(Concert);
      // Création du Day
      const day = dayRepository.create({
        title: dto.title,
        date: new Date(dto.date),
      });
      // Si concertIds est fourni, on associe les concerts
      if (dto.concertIds && dto.concertIds.length > 0) {
        const concerts = await concertRepository.findBy({
          id: In(dto.concertIds),
        });
        if (concerts.length !== dto.concertIds.length) {
          return res.status(404).json({
            message: "Un ou plusieurs concerts n'ont pas été trouvés.",
          });
        }
        day.concerts = concerts;
      }
      const saved = await dayRepository.save(day);
      return res.status(201).json(saved);
    } catch (error) {
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // PUT /api/days/:id
  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const dto = req.dto as CreateDayDto;
      const dayRepository = AppDataSource.getRepository(Day);
      const concertRepository = AppDataSource.getRepository(Concert);
      const day = await dayRepository.findOne({
        where: { id },
        relations: ["concerts"],
      });
      if (!day) {
        return res.status(404).json({ message: "Day non trouvé" });
      }
      day.title = dto.title;
      day.date = new Date(dto.date);
      // Si concertIds est fourni, on associe les concerts
      if (dto.concertIds) {
        if (dto.concertIds.length > 0) {
          const concerts = await concertRepository.findBy({
            id: In(dto.concertIds),
          });
          if (concerts.length !== dto.concertIds.length) {
            return res.status(404).json({
              message: "Un ou plusieurs concerts n'ont pas été trouvés.",
            });
          }
          day.concerts = concerts;
        } else {
          day.concerts = [];
        }
      }
      const saved = await dayRepository.save(day);
      // Recharge le Day avec les concerts liés
      const dayWithConcerts = await dayRepository.findOne({
        where: { id: saved.id },
        relations: ["concerts"],
      });
      return res.status(200).json(dayWithConcerts);
    } catch (error) {
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
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

    if (
      !Array.isArray(concertIds) ||
      concertIds.some((id) => isNaN(parseInt(id, 10)))
    ) {
      return res
        .status(400)
        .json({ message: "Liste d'IDs de concerts invalide" });
    }

    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const concertRepository = AppDataSource.getRepository(Concert);

      const day = await dayRepository.findOne({
        where: { id: dayId },
        relations: ["concerts"],
      });

      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      const concerts = await concertRepository.findByIds(concertIds);

      if (concerts.length !== concertIds.length) {
        return res
          .status(404)
          .json({ message: "Un ou plusieurs concerts non trouvés" });
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
