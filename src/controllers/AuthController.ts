// src/controllers/AuthController.ts
import * as bcrypt from "bcrypt";
import { validate } from "class-validator";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

class AuthController {
  static async register(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User);
    const { username, email, password } = req.body;

    // Validation des données
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await userRepository.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    // Hachage du mot de passe
    user.password = await bcrypt.hash(password, 10);

    // Enregistrement de l'utilisateur
    try {
      await userRepository.save(user);
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de l’utilisateur" });
    }

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  }

  static async login(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = req.body;

    console.log("Login attempt with:", { email, password });

    // Validation des données
    if (!(email && password)) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Vérifier si l'utilisateur existe
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      console.log("User not found");
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password");
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    console.log("Login successful, token generated:", token);

    // Définir le token dans un cookie HTTP-Only
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Assurez-vous d'utiliser HTTPS en production
      sameSite: "strict",
      maxAge: 3600000, // 1 heure en millisecondes
    });

    res.json({ message: "Connexion réussie" });
  }
}

export default AuthController;
