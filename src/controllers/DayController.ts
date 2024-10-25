// src/controllers/DayController.ts

import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Day } from '../entity/Day';

class DayController {
  // GET /api/days
  static async getAll(req: Request, res: Response) {
    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const days = await dayRepository.find({
        relations: ['program', 'concerts'],
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
        relations: ['program', 'concerts'],
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
      const { title, date, program, concerts } = req.body;

      const day = dayRepository.create({ title, date, program, concerts });

      const errors = await validate(day);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      await dayRepository.save(day);
      return res.status(201).json(day);
    } catch (error) {
      console.error('Erreur lors de la création du jour:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // PUT /api/days/:id
  static async update(req: Request, res: Response) {
    const dayId = parseInt(req.params.id);

    try {
      const dayRepository = AppDataSource.getRepository(Day);
      let day = await dayRepository.findOne({
        where: { id: dayId },
        relations: ['program', 'concerts'],
      });

      if (!day) {
        return res.status(404).json({ message: 'Jour non trouvé' });
      }

      dayRepository.merge(day, req.body);
      const errors = await validate(day);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const results = await dayRepository.save(day);
      return res.status(200).json(results);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du jour:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // DELETE /api/days/:id
  static async delete(req: Request, res: Response) {
    const dayId = parseInt(req.params.id);

    try {
      const dayRepository = AppDataSource.getRepository(Day);
      const result = await dayRepository.delete(dayId);

      if (result.affected === 1) {
        return res.status(200).json({ message: 'Jour supprimé avec succès' });
      } else {
        return res.status(404).json({ message: 'Jour non trouvé' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du jour:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}

export default DayController;
