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

  // GET /api/securityInfos/:id
  static async getById(req: Request, res: Response) {
    const securityInfoId = parseInt(req.params.id);

    try {
      const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
      const info = await securityInfoRepository.findOne({
        where: { id: securityInfoId },
      });

      if (!info) {
        return res
          .status(404)
          .json({ message: 'Information de sécurité non trouvée' });
      }

      return res.status(200).json(info);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de l’information de sécurité:',
        error,
      );
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // POST /api/securityInfos
  static async create(req: Request, res: Response) {
    try {
      const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
      const { title, description, urgence, actif } = req.body;

      const info = securityInfoRepository.create({
        title,
        description,
        urgence,
        actif,
      });

      const errors = await validate(info);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      await securityInfoRepository.save(info);
      return res.status(201).json(info);
    } catch (error) {
      console.error(
        'Erreur lors de la création de l’information de sécurité:',
        error,
      );
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // PUT /api/securityInfos/:id
  static async update(req: Request, res: Response) {
    const securityInfoId = parseInt(req.params.id);

    try {
      const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
      let info = await securityInfoRepository.findOne({
        where: { id: securityInfoId },
      });

      if (!info) {
        return res
          .status(404)
          .json({ message: 'Information de sécurité non trouvée' });
      }

      const { title, description, urgence, actif } = req.body;
      securityInfoRepository.merge(info, {
        title,
        description,
        urgence,
        actif,
      });

      const errors = await validate(info);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const results = await securityInfoRepository.save(info);
      return res.status(200).json(results);
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de l’information de sécurité:',
        error,
      );
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // DELETE /api/securityInfos/:id
  static async delete(req: Request, res: Response) {
    const securityInfoId = parseInt(req.params.id);

    try {
      const securityInfoRepository = AppDataSource.getRepository(SecurityInfo);
      const result = await securityInfoRepository.delete(securityInfoId);

      if (result.affected === 1) {
        return res
          .status(200)
          .json({ message: 'Information de sécurité supprimée avec succès' });
      } else {
        return res
          .status(404)
          .json({ message: 'Information de sécurité non trouvée' });
      }
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de l’information de sécurité:',
        error,
      );
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}

export default SecurityInfoController;
