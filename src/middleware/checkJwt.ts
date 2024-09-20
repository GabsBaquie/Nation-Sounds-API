// src/middleware/checkJwt.ts
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Récupérer le token depuis l'en-tête
  const token = <string>req.headers["auth"];
  let jwtPayload;

  try {
    jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET as string);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  // Rafraîchir le token
  const { userId } = jwtPayload;
  const newToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  res.setHeader("token", newToken);

  next();
};
