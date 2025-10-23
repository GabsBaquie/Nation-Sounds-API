import { NextFunction, Request, Response } from "express";
import {
  CreatePartenaireDto,
  UpdatePartenaireDto,
} from "../dto/requests/partenaire.dto";

export const validateCreatePartenaire = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, link, logo_url, logo_alt, actif } = req.body;

    // Validation basique
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        message: "Le nom est requis et doit être une chaîne non vide",
      });
    }

    if (!type || typeof type !== "string" || type.trim().length === 0) {
      return res.status(400).json({
        message: "Le type est requis et doit être une chaîne non vide",
      });
    }

    // Validation optionnelle pour le lien
    if (link && typeof link !== "string") {
      return res.status(400).json({
        message: "Le lien doit être une chaîne de caractères",
      });
    }

    // Validation optionnelle pour l'URL du logo
    if (logo_url && typeof logo_url !== "string") {
      return res.status(400).json({
        message: "L'URL du logo doit être une chaîne de caractères",
      });
    }

    // Validation optionnelle pour le texte alternatif du logo
    if (logo_alt && typeof logo_alt !== "string") {
      return res.status(400).json({
        message:
          "Le texte alternatif du logo doit être une chaîne de caractères",
      });
    }

    const dto: CreatePartenaireDto = {
      name: name.trim(),
      type: type.trim(),
      link: link?.trim() || undefined,
      logo_url: logo_url?.trim() || undefined,
      logo_alt: logo_alt?.trim() || undefined,
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

export const validateUpdatePartenaire = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, link, logo_url, logo_alt, actif } = req.body;

    // Validation basique pour les champs fournis
    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim().length === 0)
    ) {
      return res.status(400).json({
        message: "Le nom doit être une chaîne non vide",
      });
    }

    if (
      type !== undefined &&
      (typeof type !== "string" || type.trim().length === 0)
    ) {
      return res.status(400).json({
        message: "Le type doit être une chaîne non vide",
      });
    }

    // Validation optionnelle pour le lien
    if (link !== undefined && typeof link !== "string") {
      return res.status(400).json({
        message: "Le lien doit être une chaîne de caractères",
      });
    }

    // Validation optionnelle pour l'URL du logo
    if (logo_url !== undefined && typeof logo_url !== "string") {
      return res.status(400).json({
        message: "L'URL du logo doit être une chaîne de caractères",
      });
    }

    // Validation optionnelle pour le texte alternatif du logo
    if (logo_alt !== undefined && typeof logo_alt !== "string") {
      return res.status(400).json({
        message:
          "Le texte alternatif du logo doit être une chaîne de caractères",
      });
    }

    const dto: UpdatePartenaireDto = {
      name: name?.trim(),
      type: type?.trim(),
      link: link?.trim(),
      logo_url: logo_url?.trim(),
      logo_alt: logo_alt?.trim(),
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
