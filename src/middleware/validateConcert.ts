import { NextFunction, Request, Response } from "express";
import {
  CreateConcertDto,
  UpdateConcertDto,
} from "../dto/requests/concert.dto";

export const validateCreateConcert = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, performer, time, location, image, dayIds } =
      req.body;
    const errors: string[] = [];

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      errors.push(
        "Le titre est requis et doit être une chaîne de caractères non vide."
      );
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      errors.push(
        "La description est requise et doit être une chaîne de caractères non vide."
      );
    }
    if (
      !performer ||
      typeof performer !== "string" ||
      performer.trim().length === 0
    ) {
      errors.push(
        "Le performer est requis et doit être une chaîne de caractères non vide."
      );
    }
    if (!time || typeof time !== "string" || time.trim().length === 0) {
      errors.push(
        "L'heure est requise et doit être une chaîne de caractères non vide."
      );
    }
    if (
      !location ||
      typeof location !== "string" ||
      location.trim().length === 0
    ) {
      errors.push(
        "Le lieu est requis et doit être une chaîne de caractères non vide."
      );
    }
    if (image !== undefined && image !== null && typeof image !== "string") {
      errors.push("L'image doit être une chaîne de caractères ou null.");
    }
    if (dayIds !== undefined) {
      if (
        !Array.isArray(dayIds) ||
        !dayIds.every((id) => typeof id === "number" && id > 0)
      ) {
        errors.push("Tous les IDs de jours doivent être des nombres positifs.");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Erreurs de validation", errors });
    }

    const dto: CreateConcertDto = {
      title: title.trim(),
      description: description.trim(),
      performer: performer.trim(),
      time: time.trim(),
      location: location.trim(),
      image: image || undefined,
      dayIds: dayIds || [],
    };

    (req as any).dto = dto;
    next();
  } catch (error) {
    console.error("Erreur de validation:", error);
    res.status(500).json({ message: "Erreur serveur lors de la validation" });
  }
};

export const validateUpdateConcert = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, performer, time, location, image, dayIds } =
      req.body;
    const errors: string[] = [];

    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim().length === 0)
    ) {
      errors.push("Le titre doit être une chaîne de caractères non vide.");
    }
    if (
      description !== undefined &&
      (typeof description !== "string" || description.trim().length === 0)
    ) {
      errors.push(
        "La description doit être une chaîne de caractères non vide."
      );
    }
    if (
      performer !== undefined &&
      (typeof performer !== "string" || performer.trim().length === 0)
    ) {
      errors.push("Le performer doit être une chaîne de caractères non vide.");
    }
    if (
      time !== undefined &&
      (typeof time !== "string" || time.trim().length === 0)
    ) {
      errors.push("L'heure doit être une chaîne de caractères non vide.");
    }
    if (
      location !== undefined &&
      (typeof location !== "string" || location.trim().length === 0)
    ) {
      errors.push("Le lieu doit être une chaîne de caractères non vide.");
    }
    if (image !== undefined && image !== null && typeof image !== "string") {
      errors.push("L'image doit être une chaîne de caractères ou null.");
    }
    if (dayIds !== undefined) {
      if (
        !Array.isArray(dayIds) ||
        !dayIds.every((id) => typeof id === "number" && id > 0)
      ) {
        errors.push("Tous les IDs de jours doivent être des nombres positifs.");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Erreurs de validation", errors });
    }

    const dto: Partial<UpdateConcertDto> = {};
    if (title !== undefined) dto.title = title.trim();
    if (description !== undefined) dto.description = description.trim();
    if (performer !== undefined) dto.performer = performer.trim();
    if (time !== undefined) dto.time = time.trim();
    if (location !== undefined) dto.location = location.trim();
    if (image !== undefined) dto.image = image || undefined;
    if (dayIds !== undefined) dto.dayIds = dayIds;

    (req as any).dto = dto;
    next();
  } catch (error) {
    console.error("Erreur de validation:", error);
    res.status(500).json({ message: "Erreur serveur lors de la validation" });
  }
};
