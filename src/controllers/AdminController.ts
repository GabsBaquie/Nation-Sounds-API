// src/controllers/AdminController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source"; // Assurez-vous que ce chemin est correct
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

class AdminController {
  static async createUser(req: Request, res: Response) {
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
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de l’utilisateur" });
    }

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  }

  // Ajoutez d'autres méthodes admin si nécessaire
}

export default AdminController;
