// src/controllers/ConcertController.ts

import { Request, Response } from "express";
import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { CreateConcertDto } from "../dto/create-concert.dto";
import { Concert } from "../entity/Concert";
import { Day } from "../entity/Day";

class ConcertController {
  // GET /api/concerts
  static async getAll(req: Request, res: Response) {
    try {
      const concertRepository = AppDataSource.getRepository(Concert);
      const concerts = await concertRepository.find({ relations: ["days"] });
      // Transforme l'image Buffer en base64 pour chaque concert
      const concertsWithImage = concerts.map((concert) => ({
        ...concert,
        image: concert.image
          ? `data:image/png;base64,${concert.image.toString("base64")}`
          : null,
      }));
      return res.status(200).json(concertsWithImage);
    } catch (error) {
      console.error("Erreur lors de la récupération des concerts:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // GET /api/concerts/:id
  static async getById(req: Request, res: Response) {
    const concertId = parseInt(req.params.id);

    try {
      const concertRepository = AppDataSource.getRepository(Concert);
      const concert = await concertRepository.findOne({
        where: { id: concertId },
        relations: ["days"],
      });

      if (!concert) {
        return res.status(404).json({ message: "Concert non trouvé" });
      }

      // Transforme l'image Buffer en base64
      const imageBase64 = concert.image
        ? `data:image/png;base64,${concert.image.toString("base64")}`
        : null;

      return res.status(200).json({ ...concert, image: imageBase64 });
    } catch (error) {
      console.error("Erreur lors de la récupération du concert:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // POST /api/concerts
  static async create(req: Request, res: Response) {
    try {
      const dto = req.dto as CreateConcertDto;
      const concertRepository = AppDataSource.getRepository(Concert);
      const dayRepository = AppDataSource.getRepository(Day);
      const concert = concertRepository.create({
        title: dto.title,
        description: dto.description,
        performer: dto.performer,
        time: dto.time,
        location: dto.location,
        image: dto.image
          ? Buffer.from(
              dto.image.replace(/^data:image\/\w+;base64,/, ""),
              "base64"
            )
          : undefined,
      });
      if (dto.dayIds && dto.dayIds.length > 0) {
        const days = await dayRepository.findBy({ id: In(dto.dayIds) });
        if (days.length !== dto.dayIds.length) {
          return res
            .status(404)
            .json({ message: "Un ou plusieurs days n'ont pas été trouvés." });
        }
        concert.days = days;
      }
      // Log de debug avant sauvegarde
      console.log("Concert à sauvegarder :", {
        title: concert.title,
        description: concert.description,
        performer: concert.performer,
        time: concert.time,
        location: concert.location,
        imageType: typeof concert.image,
        imageIsBuffer: concert.image instanceof Buffer,
        imageLength: concert.image?.length,
      });
      const saved = await concertRepository.save(concert);
      // Recharge avec les days liés pour la réponse
      const concertWithDays = await concertRepository.findOne({
        where: { id: saved.id },
        relations: ["days"],
      });
      // Transforme l'image Buffer en base64
      const imageBase64 = concertWithDays?.image
        ? `data:image/png;base64,${concertWithDays.image.toString("base64")}`
        : null;
      return res.status(201).json({ ...concertWithDays, image: imageBase64 });
    } catch (error) {
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // PUT /api/concerts/:id
  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const dto = req.dto as CreateConcertDto;
      const concertRepository = AppDataSource.getRepository(Concert);
      const dayRepository = AppDataSource.getRepository(Day);
      const concert = await concertRepository.findOne({
        where: { id },
        relations: ["days"],
      });
      if (!concert) {
        return res.status(404).json({ message: "Concert non trouvé" });
      }
      concert.title = dto.title;
      concert.description = dto.description;
      concert.performer = dto.performer;
      concert.time = dto.time;
      concert.location = dto.location;
      if (dto.image) {
        concert.image = Buffer.from(
          dto.image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
      }
      // Log de debug avant sauvegarde
      console.log("Concert à sauvegarder :", {
        title: concert.title,
        description: concert.description,
        performer: concert.performer,
        time: concert.time,
        location: concert.location,
        imageType: typeof concert.image,
        imageIsBuffer: concert.image instanceof Buffer,
        imageLength: concert.image?.length,
      });
      const saved = await concertRepository.save(concert);
      // Recharge avec les days liés pour la réponse
      const concertWithDays = await concertRepository.findOne({
        where: { id: saved.id },
        relations: ["days"],
      });
      // Transforme l'image Buffer en base64
      const imageBase64 = concertWithDays?.image
        ? `data:image/png;base64,${concertWithDays.image.toString("base64")}`
        : null;
      return res.status(200).json({ ...concertWithDays, image: imageBase64 });
    } catch (error) {
      return res.status(500).json({
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  // DELETE /api/concerts/:id
  static async delete(req: Request, res: Response) {
    const concertId = parseInt(req.params.id);

    try {
      const concertRepository = AppDataSource.getRepository(Concert);
      const result = await concertRepository.delete(concertId);

      if (result.affected === 1) {
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
}

export default ConcertController;
