// src/controllers/ProgramController.ts

import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Day } from '../entity/Day';
class ProgramController {
  // GET /api/programs
  static async getAll(req: Request, res: Response) {
    try {
      const programRepository = AppDataSource.getRepository(Day);
      const programs = await programRepository.find({
        relations: ['day', 'day.concerts'],
      });
      return res.status(200).json(programs);
    } catch (error) {
      console.error('Erreur lors de la récupération des programmes:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // GET /api/programs/:id
  static async getById(req: Request, res: Response) {
    const programId = parseInt(req.params.id);

    try {
      const programRepository = AppDataSource.getRepository(Day);
      const program = await programRepository.findOne({
        where: { id: programId },
        relations: ['day', 'day.concerts'],
      });

      if (!program) {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }

      return res.status(200).json(program);
    } catch (error) {
      console.error('Erreur lors de la récupération du programme:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}


export default ProgramController;
