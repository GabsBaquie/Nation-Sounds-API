import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class AdminController {
  static async createUser(req: Request, res: Response) {
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

    try {
      // Vérifier si l'email ou le username existe déjà
      const emailExists = await UserService.emailExists(email);
      if (emailExists) {
        return res.status(409).json({ message: "Email déjà utilisé" });
      }

      const usernameExists = await UserService.usernameExists(username);
      if (usernameExists) {
        return res
          .status(409)
          .json({ message: "Nom d'utilisateur déjà utilisé" });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur
      const newUser = await UserService.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      return res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de l'utilisateur" });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    try {
      const user = await UserService.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Validation pour s'assurer que l'email est un Gmail (si l'email est fourni pour la mise à jour)
      if (email && !email.endsWith("@gmail.com")) {
        return res
          .status(400)
          .json({ message: "Seules les adresses Gmail sont autorisées." });
      }

      // Vérifier les doublons
      if (email && (await UserService.emailExists(email, userId))) {
        return res.status(409).json({ message: "Email déjà utilisé" });
      }

      if (username && (await UserService.usernameExists(username, userId))) {
        return res
          .status(409)
          .json({ message: "Nom d'utilisateur déjà utilisé" });
      }

      // Mise à jour de l'utilisateur
      const updatedUser = await UserService.update(userId, {
        username,
        email,
        role,
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    try {
      const user = await UserService.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Si l'utilisateur à supprimer est un admin, vérifier qu'il reste au moins un autre admin
      if (user.role === "admin") {
        const adminCount = await UserService.countByRole("admin");
        if (adminCount <= 1) {
          return res
            .status(400)
            .json({
              message: "Impossible de supprimer le dernier administrateur",
            });
        }
      }

      const deleted = await UserService.delete(userId);

      if (deleted) {
        return res
          .status(200)
          .json({ message: "Utilisateur supprimé avec succès" });
      } else {
        return res
          .status(500)
          .json({ message: "Erreur lors de la suppression" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.findAll();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  }

  static async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    try {
      const user = await UserService.findById(userId);

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
