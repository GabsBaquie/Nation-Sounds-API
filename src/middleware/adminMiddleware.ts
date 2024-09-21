// src/middleware/adminMiddleware.ts
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json({ message: "Non autorisé - Utilisateur non identifié" });
  }

  try {
    const foundUser = await AppDataSource.getRepository(User).findOne({
      where: { id: user.id },
    });

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
