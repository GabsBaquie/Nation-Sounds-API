// src/controllers/ContentController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Content } from "../entity/Content";

class ContentController {
  static async getAll(req: Request, res: Response) {
    try {
      const contentRepository = AppDataSource.getRepository(Content);
      const contents = await contentRepository.find();
      return res.status(200).json(contents);
    } catch (error) {
      console.error("Erreur lors de la récupération des contenus:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async getById(req: Request, res: Response) {
    const contentId = parseInt(req.params.id);

    try {
      const contentRepository = AppDataSource.getRepository(Content);
      const content = await contentRepository.findOne({
        where: { id: contentId },
      });

      if (!content) {
        return res.status(404).json({ message: "Contenu non trouvé" });
      }

      return res.status(200).json(content);
    } catch (error) {
      console.error("Erreur lors de la récupération du contenu:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const contentRepository = AppDataSource.getRepository(Content);
      const content = contentRepository.create(req.body);
      await contentRepository.save(content);
      return res.status(201).json(content);
    } catch (error) {
      console.error("Erreur lors de la création du contenu:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async update(req: Request, res: Response) {
    const contentId = parseInt(req.params.id);

    try {
      const contentRepository = AppDataSource.getRepository(Content);
      let content = await contentRepository.findOne({
        where: { id: contentId },
      });

      if (!content) {
        return res.status(404).json({ message: "Contenu non trouvé" });
      }

      contentRepository.merge(content, req.body);
      const results = await contentRepository.save(content);
      return res.status(200).json(results);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contenu:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async delete(req: Request, res: Response) {
    const contentId = parseInt(req.params.id);

    try {
      const contentRepository = AppDataSource.getRepository(Content);
      const result = await contentRepository.delete(contentId);

      if (result.affected === 1) {
        return res
          .status(200)
          .json({ message: "Contenu supprimé avec succès" });
      } else {
        return res.status(404).json({ message: "Contenu non trouvé" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du contenu:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default ContentController;
