// src/controllers/ProgramController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Program } from "../entity/Program";

class ProgramController {
  static async getAll(req: Request, res: Response) {
    const programRepository = AppDataSource.getRepository(Program);

    try {
      const programs = await programRepository.find();
      res.json(programs);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des programmes" });
    }
  }

  static async getById(req: Request, res: Response) {
    const programRepository = AppDataSource.getRepository(Program);
    const id = parseInt(req.params.id);

    try {
      const program = await programRepository.findOneOrFail({ where: { id } });
      res.json(program);
    } catch (error) {
      res.status(404).json({ message: "Programme non trouvé" });
    }
  }

  static async create(req: Request, res: Response) {
    const programRepository = AppDataSource.getRepository(Program);
    const { artistName, stage, startTime, endTime, date } = req.body;

    const program = new Program();
    program.artistName = artistName;
    program.stage = stage;
    program.startTime = new Date(startTime);
    program.endTime = new Date(endTime);
    program.date = new Date(date);

    try {
      await programRepository.save(program);
      res.status(201).json({ message: "Programme créé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la création du programme" });
    }
  }

  static async update(req: Request, res: Response) {
    const programRepository = AppDataSource.getRepository(Program);
    const id = parseInt(req.params.id);
    const { artistName, stage, startTime, endTime, date } = req.body;

    try {
      const program = await programRepository.findOneOrFail({ where: { id } });
      program.artistName = artistName;
      program.stage = stage;
      program.startTime = new Date(startTime);
      program.endTime = new Date(endTime);
      program.date = new Date(date);

      await programRepository.save(program);
      res.json({ message: "Programme mis à jour avec succès" });
    } catch (error) {
      res.status(404).json({ message: "Programme non trouvé" });
    }
  }

  static async delete(req: Request, res: Response) {
    const programRepository = AppDataSource.getRepository(Program);
    const id = parseInt(req.params.id);

    try {
      const program = await programRepository.findOneBy({ id });

      if (!program) {
        return res.status(404).json({ message: "Programme non trouvé" });
      }

      await programRepository.delete(id);
      res.json({ message: "Programme supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du programme" });
    }
  }
}

export default ProgramController;
