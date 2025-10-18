import { Request, Response } from "express";
import { CreateConcertDto } from "../dto/requests/create-concert.dto";
import { ConcertService } from "../services/ConcertService";
import "../types/express";

const normalizeConcertImage = (concert: any) => {
  if (!concert) return null;
  return {
    ...concert,
    image: concert.image ?? null,
  };
};

export class ConcertController {
  // GET /api/concerts
  static async getAll(req: Request, res: Response) {
    try {
      const concerts = await ConcertService.findAll();
      return res.status(200).json(concerts.map(normalizeConcertImage));
    } catch (error) {
      console.error("Erreur lors de la récupération des concerts:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // GET /api/concerts/:id
  static async getById(req: Request, res: Response) {
    const concertId = parseInt(req.params.id);

    if (isNaN(concertId)) {
      return res.status(400).json({ message: "ID de concert invalide" });
    }

    try {
      const concert = await ConcertService.findById(concertId);

      if (!concert) {
        return res.status(404).json({ message: "Concert non trouvé" });
      }

      return res.status(200).json(normalizeConcertImage(concert));
    } catch (error) {
      console.error("Erreur lors de la récupération du concert:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // POST /api/concerts
  static async create(req: Request, res: Response) {
    try {
      const dto = req.dto as CreateConcertDto;
      const concert = await ConcertService.create(dto);
      return res.status(201).json(normalizeConcertImage(concert));
    } catch (error) {
      console.error("Erreur lors de la création du concert:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // PUT /api/concerts/:id
  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de concert invalide" });
    }

    try {
      const dto = req.dto as CreateConcertDto;
      const concert = await ConcertService.update(id, dto);

      if (!concert) {
        return res.status(404).json({ message: "Concert non trouvé" });
      }

      return res.status(200).json(normalizeConcertImage(concert));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du concert:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // DELETE /api/concerts/:id
  static async delete(req: Request, res: Response) {
    const concertId = parseInt(req.params.id);

    if (isNaN(concertId)) {
      return res.status(400).json({ message: "ID de concert invalide" });
    }

    try {
      const deleted = await ConcertService.delete(concertId);

      if (deleted) {
        return res
          .status(200)
          .json({ message: "Concert supprimé avec succès" });
      } else {
        return res.status(404).json({ message: "Concert non trouvé" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du concert:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // GET /api/concerts/search?q=term
  static async search(req: Request, res: Response) {
    const searchTerm = req.query.q as string;

    if (!searchTerm) {
      return res.status(400).json({ message: "Terme de recherche requis" });
    }

    try {
      const concerts = await ConcertService.search(searchTerm);
      return res.status(200).json(concerts.map(normalizeConcertImage));
    } catch (error) {
      console.error("Erreur lors de la recherche de concerts:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default ConcertController;
