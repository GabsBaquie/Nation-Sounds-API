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
        relations: ['concerts'],
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
        relations: ['concerts'],
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

  // POST /api/programs
  static async create(req: Request, res: Response) {
    try {
      const programRepository = AppDataSource.getRepository(Day);
      const { title, date, concerts } = req.body;

      const program = programRepository.create({
        title,
        date,
        concerts: concerts || []
      });

      const errors = await validate(program);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      await programRepository.save(program);
      return res.status(201).json(program);
    } catch (error) {
      console.error('Erreur lors de la création du programme:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // PUT /api/programs/:id
  static async update(req: Request, res: Response) {
    const programId = parseInt(req.params.id);

    try {
      const programRepository = AppDataSource.getRepository(Day);
      let program = await programRepository.findOne({
        where: { id: programId },
        relations: ['concerts'],
      });

      if (!program) {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }

      const { title, date, concerts } = req.body;
      
      if (title !== undefined) program.title = title;
      if (date !== undefined) program.date = date;
      if (concerts !== undefined) program.concerts = concerts;

      const errors = await validate(program);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const results = await programRepository.save(program);
      return res.status(200).json(results);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du programme:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // DELETE /api/programs/:id
  static async delete(req: Request, res: Response) {
    const programId = parseInt(req.params.id);

    try {
      const programRepository = AppDataSource.getRepository(Day);
      const program = await programRepository.findOne({
        where: { id: programId },
        relations: ['concerts'],
      });

      if (!program) {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }

      // Détacher les concerts avant la suppression
      program.concerts = [];
      await programRepository.save(program);

      const result = await programRepository.delete(programId);
      
      if (result.affected === 1) {
        return res.status(200).json({ message: 'Programme supprimé avec succès' });
      } else {
        return res.status(404).json({ message: 'Programme non trouvé' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du programme:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}

export default ProgramController;
