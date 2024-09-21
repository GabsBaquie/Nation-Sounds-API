// src/middleware/checkJwt.ts
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Récupérer le token depuis le cookie
  const token = req.cookies.token;
  let jwtPayload;

  if (!token) {
    return res.status(401).json({ message: "Non autorisé - Token manquant" });
  }

  try {
    jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET as string);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return res.status(401).json({ message: "Non autorisé - Token invalide" });
  }

  // Optionnel : Rafraîchir le token si nécessaire
  // const { userId } = jwtPayload;
  // const newToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
  //   expiresIn: "1h",
  // });
  // res.cookie('token', newToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'strict',
  //   maxAge: 3600000,
  // });

  next();
};
