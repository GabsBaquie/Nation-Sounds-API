// src/controllers/SecurityInfoController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SecurityInfo } from "../entity/SecurityInfo";

class SecurityInfoController {
  static async getAll(req: Request, res: Response) {
    const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
    const infos = await securityInfoRepository.find({
      order: { createdAt: "DESC" },
    });
    res.json(infos);
  }

  static async create(req: Request, res: Response) {
    const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
    const { title, message } = req.body;

    const info = new SecurityInfo();
    info.title = title;
    info.message = message;

    try {
      await securityInfoRepository.save(info);
      res
        .status(201)
        .json({ message: "Information de sécurité créée avec succès" });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la création de l’information de sécurité",
      });
    }
  }
}

export default SecurityInfoController;
