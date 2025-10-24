import { NextFunction, Request, Response } from "express";
import {
  CreateActualiteDto,
  UpdateActualiteDto,
} from "../dto/requests/actualite.dto";

export const validateCreateActualite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, text, image, importance, actif } = req.body;

    // Validation basique
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        message: "Le titre est requis et doit être une chaîne non vide",
      });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      return res.status(400).json({
        message: "La description est requise et doit être une chaîne non vide",
      });
    }

    if (
      importance &&
      !["Très important", "Important", "Modéré", "Peu important"].includes(
        importance
      )
    ) {
      return res.status(400).json({
        message:
          "L'importance doit être l'une des valeurs suivantes: 'Très important', 'Important', 'Modéré', 'Peu important'",
      });
    }

    const dto: CreateActualiteDto = {
      title: title.trim(),
      description: description.trim(),
      text: text?.trim() || undefined,
      image: image === null ? null : image?.trim() || undefined,
      importance: importance || "Modéré",
      actif: actif !== undefined ? actif : true,
    };

    (req as any).dto = dto;
    next();
  } catch (error) {
    console.error("Erreur de validation:", error);
    return res.status(500).json({
      message: "Erreur de validation",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const validateUpdateActualite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, text, image, importance, actif } = req.body;

    // Validation basique pour les champs fournis
    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim().length === 0)
    ) {
      return res.status(400).json({
        message: "Le titre doit être une chaîne non vide",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.trim().length === 0)
    ) {
      return res.status(400).json({
        message: "La description doit être une chaîne non vide",
      });
    }

    if (
      importance &&
      !["Très important", "Important", "Modéré", "Peu important"].includes(
        importance
      )
    ) {
      return res.status(400).json({
        message:
          "L'importance doit être l'une des valeurs suivantes: 'Très important', 'Important', 'Modéré', 'Peu important'",
      });
    }

    const dto: UpdateActualiteDto = {
      title: title?.trim(),
      description: description?.trim(),
      text: text?.trim(),
      image: image === null ? null : image?.trim(),
      importance,
      actif,
    };

    (req as any).dto = dto;
    next();
  } catch (error) {
    console.error("Erreur de validation:", error);
    return res.status(500).json({
      message: "Erreur de validation",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
