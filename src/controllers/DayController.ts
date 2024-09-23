// src/controllers/DayController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Day } from "../entity/Day";

class DayController {
  static async getAll(req: Request, res: Response) {
    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const days = await dayRepository.find({ relations: ["concerts"] });
      return res.status(200).json(days);
    } catch (error) {
      console.error("Erreur lors de la récupération des jours:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

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

  static async create(req: Request, res: Response) {
    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const { name, date, concerts } = req.body;

      const day = dayRepository.create({
        name,
        date,
        concerts,
      });
      await dayRepository.save(day);
      return res.status(201).json(day);
    } catch (error) {
      console.error("Erreur lors de la création du jour:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async update(req: Request, res: Response) {
    const dayId = parseInt(req.params.id);

    try {
      const dayRepository = AppDataSource.getRepository(Day);
      let day = await dayRepository.findOne({ where: { id: dayId } });

      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      const { name, date, concerts } = req.body;
      dayRepository.merge(day, { name, date, concerts });
      const results = await dayRepository.save(day);
      return res.status(200).json(results);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du jour:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async delete(req: Request, res: Response) {
    const dayId = parseInt(req.params.id);

    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const result = await dayRepository.delete(dayId);

      if (result.affected === 1) {
        return res.status(200).json({ message: "Jour supprimé avec succès" });
      } else {
        return res.status(404).json({ message: "Jour non trouvé" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du jour:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default DayController;
