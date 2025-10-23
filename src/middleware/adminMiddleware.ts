// src/middleware/adminMiddleware.ts
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Non autorisé - Utilisateur non identifié" });
    }

    const foundUser = await UserService.findById(userId);

    if (foundUser && foundUser.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Accès interdit - Admin seulement" });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du rôle de l'utilisateur:",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};
