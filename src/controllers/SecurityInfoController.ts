import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { SecurityInfo } from '../entity/SecurityInfo';

class SecurityInfoController {
  static async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 25;

    const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
    const [infos, total] = await securityInfoRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    res.json({
      data: infos,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    });
  }

  static async create(req: Request, res: Response) {
    const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
    const { title, description, urgence, actif } = req.body;

    const info = new SecurityInfo();
    info.title = title;
    info.description = description;
    info.urgence = urgence;
    info.actif = actif;

    try {
      await securityInfoRepository.save(info);
      res
        .status(201)
        .json({ message: 'Information de sécurité créée avec succès' });
    } catch (error) {
      res.status(500).json({
        message: 'Erreur lors de la création de l’information de sécurité',
      });
    }
  }
}

export default SecurityInfoController;
