import { Request, Response } from "express";
import { CreateDayDto } from "../dto/requests/create-day.dto";
import { DayService } from "../services/DayService";
import "../types/express";

export class DayController {
  // GET /api/days
  static async getAll(req: Request, res: Response) {
    try {
      const days = await DayService.findAll();
      return res.status(200).json(days);
    } catch (error) {
      console.error("Erreur lors de la récupération des jours:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // GET /api/days/:id
  static async getById(req: Request, res: Response) {
    const dayId = parseInt(req.params.id);

    if (isNaN(dayId)) {
      return res.status(400).json({ message: "ID de jour invalide" });
    }

    try {
      const day = await DayService.findById(dayId);

      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      return res.status(200).json(day);
    } catch (error) {
      console.error("Erreur lors de la récupération du jour:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // POST /api/days
  static async create(req: Request, res: Response) {
    try {
      const dto = req.dto as CreateDayDto;
      const day = await DayService.create(dto);
      return res.status(201).json(day);
    } catch (error) {
      console.error("Erreur lors de la création du jour:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // PUT /api/days/:id
  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de jour invalide" });
    }

    try {
      const dto = req.dto as CreateDayDto;
      const day = await DayService.update(id, dto);

      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      return res.status(200).json(day);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du jour:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // DELETE /api/days/:id
  static async delete(req: Request, res: Response) {
    const dayId = parseInt(req.params.id);

    if (isNaN(dayId)) {
      return res.status(400).json({ message: "ID de jour invalide" });
    }

    try {
      const deleted = await DayService.delete(dayId);

      if (deleted) {
        return res.status(200).json({ message: "Jour supprimé avec succès" });
      } else {
        return res.status(404).json({ message: "Jour non trouvé" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du jour:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // PUT /api/days/:id/concerts
  static async addConcerts(req: Request, res: Response) {
    const dayId = parseInt(req.params.id);
    const { concertIds } = req.body;

    if (isNaN(dayId)) {
      return res.status(400).json({ message: "ID de jour invalide" });
    }

    if (
      !Array.isArray(concertIds) ||
      concertIds.some((id: any) => isNaN(parseInt(id)))
    ) {
      return res
        .status(400)
        .json({ message: "Liste d'IDs de concerts invalide" });
    }

    try {
      const day = await DayService.addConcerts(dayId, concertIds);

      if (!day) {
        return res.status(404).json({ message: "Jour non trouvé" });
      }

      return res.status(200).json(day);
    } catch (error) {
      console.error("Erreur lors de l'ajout de concerts au jour:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Erreur serveur",
      });
    }
  }

  // GET /api/days/date-range?start=YYYY-MM-DD&end=YYYY-MM-DD
  static async getByDateRange(req: Request, res: Response) {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Dates de début et de fin requises" });
    }

    try {
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Format de date invalide" });
      }

      const days = await DayService.findByDateRange(startDate, endDate);
      return res.status(200).json(days);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des jours par plage de dates:",
        error
      );
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default DayController;
