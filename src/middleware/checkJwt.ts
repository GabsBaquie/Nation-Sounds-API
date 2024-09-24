// src/middleware/checkJwt.ts
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Récupérer le token depuis le cookie
  let token = req.cookies.token;

  // Si le token n'est pas dans les cookies, essayer de le récupérer depuis les headers Authorization
  if (!token) {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Non autorisé - Token manquant" });
  }

  let jwtPayload: any;

  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return res.status(401).json({ message: "Non autorisé - Token invalide" });
  }

  // Optionnel : Rafraîchir le token si nécessaire
  const { userId, role, username, email } = jwtPayload;
  const newToken = jwt.sign(
    { userId, role, username, email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "24h",
    }
  );
  res.cookie("token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
  });

  next();
};
