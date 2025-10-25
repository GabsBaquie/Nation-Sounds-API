import { NextFunction, Request, Response } from "express";
import { CreateDayDto } from "../dto/requests/day.dto";

export const validateCreateDay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, date, image, concertIds } = req.body;

    // Validation des champs requis
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        message: "Le titre est requis et doit être une chaîne non vide",
      });
    }

    if (!date || typeof date !== "string") {
      return res.status(400).json({
        message: "La date est requise et doit être une chaîne",
      });
    }

    // Validation de la date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        message: "La date doit être une date valide",
      });
    }

    // Validation de l'image (optionnel)
    if (image !== undefined && image !== null && typeof image !== "string") {
      return res.status(400).json({
        message: "L'image doit être une chaîne ou null",
      });
    }

    // Validation des concertIds (optionnel)
    if (concertIds !== undefined) {
      if (!Array.isArray(concertIds)) {
        return res.status(400).json({
          message: "Les IDs de concerts doivent être un tableau",
        });
      }

      if (!concertIds.every((id) => typeof id === "number" && id > 0)) {
        return res.status(400).json({
          message: "Tous les IDs de concerts doivent être des nombres positifs",
        });
      }
    }

    // Créer le DTO validé
    const dto: CreateDayDto = {
      title: title.trim(),
      date,
      image: image || undefined,
      concertIds: concertIds || [],
    };

    (req as any).dto = dto;
    next();
  } catch (error) {
    console.error("Erreur de validation:", error);
    return res.status(500).json({
      message: "Erreur de validation",
    });
  }
};

export const validateUpdateDay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, date, image, concertIds } = req.body;

    // Validation du titre (optionnel pour la mise à jour)
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({
          message: "Le titre doit être une chaîne non vide",
        });
      }
    }

    // Validation de la date (optionnel pour la mise à jour)
    if (date !== undefined) {
      if (typeof date !== "string") {
        return res.status(400).json({
          message: "La date doit être une chaîne",
        });
      }

      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          message: "La date doit être une date valide",
        });
      }
    }

    // Validation de l'image (optionnel)
    if (image !== undefined && image !== null && typeof image !== "string") {
      return res.status(400).json({
        message: "L'image doit être une chaîne ou null",
      });
    }

    // Validation des concertIds (optionnel)
    if (concertIds !== undefined) {
      if (!Array.isArray(concertIds)) {
        return res.status(400).json({
          message: "Les IDs de concerts doivent être un tableau",
        });
      }

      if (!concertIds.every((id) => typeof id === "number" && id > 0)) {
        return res.status(400).json({
          message: "Tous les IDs de concerts doivent être des nombres positifs",
        });
      }
    }

    // Créer le DTO validé avec seulement les champs fournis
    const dto: Partial<CreateDayDto> = {};
    if (title !== undefined) dto.title = title.trim();
    if (date !== undefined) dto.date = date;
    if (image !== undefined) dto.image = image || undefined;
    if (concertIds !== undefined) dto.concertIds = concertIds;

    // Extend Request type to include dto property
    (req as any).dto = dto;
    next();
  } catch (error) {
    console.error("Erreur de validation:", error);
    return res.status(500).json({
      message: "Erreur de validation",
    });
  }
};
