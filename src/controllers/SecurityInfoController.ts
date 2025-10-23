import { Request, Response } from "express";
import { CreateSecurityInfoDto } from "../dto/requests/security-info.dto";
import { SecurityInfoService } from "../services/SecurityInfoService";

class SecurityInfoController {
  // GET /api/securityInfos
  static async getAll(req: Request, res: Response) {
    try {
      const infos = await SecurityInfoService.findAll();
      return res.status(200).json(infos);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de sécurité:",
        error
      );
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // GET /api/securityInfos/:id
  static async getById(req: Request, res: Response) {
    const securityInfoId = parseInt(req.params.id);

    if (isNaN(securityInfoId)) {
      return res
        .status(400)
        .json({ message: "ID d'information de sécurité invalide" });
    }

    try {
      const info = await SecurityInfoService.findById(securityInfoId);

      if (!info) {
        return res
          .status(404)
          .json({ message: "Information de sécurité non trouvée" });
      }

      return res.status(200).json(info);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'information de sécurité:",
        error
      );
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // POST /api/securityInfos
  static async create(req: Request, res: Response) {
    try {
      const dto = req.dto as CreateSecurityInfoDto;
      const securityInfo = await SecurityInfoService.create(dto);
      return res.status(201).json(securityInfo);
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'information de sécurité:",
        error
      );
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // PUT /api/securityInfos/:id
  static async update(req: Request, res: Response) {
    const securityInfoId = parseInt(req.params.id);

    if (isNaN(securityInfoId)) {
      return res
        .status(400)
        .json({ message: "ID d'information de sécurité invalide" });
    }

    try {
      const dto = req.dto as CreateSecurityInfoDto;
      const info = await SecurityInfoService.update(securityInfoId, dto);
      if (!info) {
        return res
          .status(404)
          .json({ message: "Information de sécurité non trouvée" });
      }
      return res.status(200).json(info);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'information de sécurité:",
        error
      );
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // DELETE /api/securityInfos/:id
  static async delete(req: Request, res: Response) {
    const securityInfoId = parseInt(req.params.id);

    if (isNaN(securityInfoId)) {
      return res
        .status(400)
        .json({ message: "ID d'information de sécurité invalide" });
    }

    try {
      const deleted = await SecurityInfoService.delete(securityInfoId);

      if (deleted) {
        return res
          .status(200)
          .json({ message: "Information de sécurité supprimée avec succès" });
      } else {
        return res
          .status(404)
          .json({ message: "Information de sécurité non trouvée" });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'information de sécurité:",
        error
      );
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default SecurityInfoController;
