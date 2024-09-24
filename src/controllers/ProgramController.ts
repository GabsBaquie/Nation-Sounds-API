// src/controllers/ProgramController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Program } from "../entity/Program";
import { validate } from "class-validator";
import { Day } from "../entity/Day";

class ProgramController {
  // GET /api/programs
  static async getAll(req: Request, res: Response) {
    try {
      const programRepository = AppDataSource.getRepository(Program);
      const programs = await programRepository.find({
        relations: ["day", "day.concerts"],
      });
      return res.status(200).json(programs);
    } catch (error) {
      console.error("Erreur lors de la récupération des programmes:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // GET /api/programs/:id
  static async getById(req: Request, res: Response) {
    const programId = parseInt(req.params.id);

    try {
      const programRepository = AppDataSource.getRepository(Program);
      const program = await programRepository.findOne({
        where: { id: programId },
        relations: ["day", "day.concerts"],
      });

      if (!program) {
        return res.status(404).json({ message: "Programme non trouvé" });
      }

      return res.status(200).json(program);
    } catch (error) {
      console.error("Erreur lors de la récupération du programme:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // POST /api/programs
  static async create(req: Request, res: Response) {
    try {
      const programRepository = AppDataSource.getRepository(Program);
      const { name, description, dayId } = req.body;

      const dayRepository = AppDataSource.getRepository(Day);
      const day = await dayRepository.findOne({ where: { id: dayId } });
      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      const program = programRepository.create({ name, description, day });

      const errors = await validate(program);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      await programRepository.save(program);
      return res.status(201).json(program);
    } catch (error) {
      console.error("Erreur lors de la création du programme:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // PUT /api/programs/:id
  static async update(req: Request, res: Response) {
    const programId = parseInt(req.params.id);

    try {
      const programRepository = AppDataSource.getRepository(Program);
      let program = await programRepository.findOne({
        where: { id: programId },
        relations: ["day", "day.concerts"],
      });

      if (!program) {
        return res.status(404).json({ message: "Programme non trouvé" });
      }

      const dayRepository = AppDataSource.getRepository(Day);
      const { name, description, dayId } = req.body;
      const day = await dayRepository.findOne({ where: { id: dayId } });
      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      programRepository.merge(program, { name, description, day });

      const errors = await validate(program);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const results = await programRepository.save(program);
      return res.status(200).json(results);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du programme:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // DELETE /api/programs/:id
  static async delete(req: Request, res: Response) {
    const programId = parseInt(req.params.id);

    try {
      const programRepository = AppDataSource.getRepository(Program);
      const result = await programRepository.delete(programId);

      if (result.affected === 1) {
        return res
          .status(200)
          .json({ message: "Programme supprimé avec succès" });
      } else {
        return res.status(404).json({ message: "Programme non trouvé" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du programme:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default ProgramController;
