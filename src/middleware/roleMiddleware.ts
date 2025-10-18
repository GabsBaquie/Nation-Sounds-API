// src/middleware/roleMiddleware.ts
import { NextFunction, Request, Response } from "express";
import "../types/express";

export const roleMiddleware = (roles: Array<"admin" | "user">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ message: "Non autorisé - Utilisateur non identifié" });
    }

    if (!roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Accès interdit - Rôle insuffisant" });
    }

    next();
  };
};
