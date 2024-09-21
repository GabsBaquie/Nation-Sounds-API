// src/controllers/AdminController.ts
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

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

  static async getUsers(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();
      return res.status(200).json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  }

  static async getUserById(req: Request, res: Response) {
    const userId = req.params.id;

    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { username, email, role } = req.body;

    try {
      // Récupérer l'utilisateur existant
      const user = await userRepository.findOne({ where: { id: Number(id) } });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Mettre à jour les champs avec les nouvelles données
      user.username = username;
      user.email = email;
      user.role = role;

      // Sauvegarder les modifications
      await userRepository.save(user);

      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  }
}

export default AdminController;
