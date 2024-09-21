// src/middleware/authMiddleware.ts
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

interface DecodedToken {
  userId: number;
  role: string;
  username: string;
  email: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Non autorisé - Token manquant" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
