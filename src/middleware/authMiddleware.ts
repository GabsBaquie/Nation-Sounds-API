import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

interface DecodedToken {
  userId: number;
  role: "admin" | "user";
  username: string;
  email: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupérer le token depuis l'en-tête Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Non autorisé - Token manquant" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // Ajouter les informations décodées du token à la requête
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      username: decoded.username,
      email: decoded.email,
    };
    next(); // Continuer avec la requête
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
