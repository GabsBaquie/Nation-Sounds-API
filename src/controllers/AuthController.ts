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
    const userRepository = AppDataSource.getRepository(User);
    const { username, email, password, role } = req.body;

    // Validation des données
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await userRepository.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    try {
      await userRepository.save(newUser);
      return res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de l'utilisateur" });
    }
  }
}

export default AuthController;
