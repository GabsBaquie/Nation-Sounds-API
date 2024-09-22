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

    // Vérifier que l'email est une adresse Gmail
    if (!email.endsWith("@gmail.com")) {
      return res
        .status(400)
        .json({ message: "Seules les adresses Gmail sont autorisées." });
    }

    // Vérifier si l'email ou le username existe déjà
    const userExists = await userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (userExists) {
      if (userExists.email === email) {
        return res.status(409).json({ message: "Email déjà utilisé" });
      }
      if (userExists.username === username) {
        return res
          .status(409)
          .json({ message: "Nom d'utilisateur déjà utilisé" });
      }
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
    } catch (e) {
      console.error("Erreur lors de la création de l'utilisateur :", e);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de l’utilisateur" });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { username, email, role } = req.body;

    // Vérification de l'ID avant conversion
    console.log("ID reçu :", id);

    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOneBy({ id: parseInt(id) });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Log des données avant modification
      console.log("Utilisateur avant modification :", user);
      console.log("Données reçues :", { username, email, role });

      // Validation pour s'assurer que l'email est un Gmail (si l'email est fourni pour la mise à jour)
      if (email && !email.endsWith("@gmail.com")) {
        return res
          .status(400)
          .json({ message: "Seules les adresses Gmail sont autorisées." });
      }

      // Mise à jour des champs si présents
      user.username = username || user.username;
      user.email = email || user.email;
      user.role = role || user.role;

      // Log après modification mais avant enregistrement
      console.log("Utilisateur après modification :", user);

      await userRepository.save(user);

      // Log après enregistrement
      console.log("Utilisateur sauvegardé :", user);

      return res.status(200).json(user);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOneBy({ id: parseInt(id) });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      await userRepository.remove(user);

      return res
        .status(200)
        .json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
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
}

export default AdminController;
