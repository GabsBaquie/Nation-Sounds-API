// src/controllers/AuthController.ts
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Email ou mot de passe invalide" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Email ou mot de passe invalide" });
      }

      // Génération du JWT
      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          name: user.username,
          mail: user.email,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );

      // Définition du cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true en production
        sameSite: "none", // 'strict' ou 'lax' pourrait ne pas fonctionner pour les requêtes cross-site
        path: "/",
        maxAge: 24 * 60 * 60 * 1000, // 1 jour
      });

      return res.status(200).json({ message: "Connexion réussie" });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async register(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    return res.status(200).json({ user: req.user });
  }
}

export default AuthController;
