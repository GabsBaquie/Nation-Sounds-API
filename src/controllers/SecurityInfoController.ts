import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { SecurityInfo } from '../entity/SecurityInfo';

class SecurityInfoController {
  // GET /api/securityInfos
  static async getAll(req: Request, res: Response) {
    try {
      const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
      const infos = await securityInfoRepository.find({
        order: { createdAt: 'DESC' },
      });

      return res.status(200).json(infos);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des informations de sécurité:',
        error,
      );
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // POST /api/securityInfos
  static async create(req: Request, res: Response) {
    const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
    const { title, description, urgence, actif } = req.body;

    const info = new SecurityInfo();
    info.title = title;
    info.description = description;
    info.urgence = urgence;
    info.actif = actif;

    const errors = await validate(info);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      await securityInfoRepository.save(info);
      return res
        .status(201)
        .json({ message: 'Information de sécurité créée avec succès' });
    } catch (error) {
      console.error(
        'Erreur lors de la création de l’information de sécurité:',
        error,
      );
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}

export default SecurityInfoController;
