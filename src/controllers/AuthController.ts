// src/controllers/AuthController.ts
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { v4 as uuidv4 } from "uuid";
import { sendResetEmail } from "../utils/emailService";
import { MoreThan } from "typeorm";

class AuthController {
  // Connexion de l'utilisateur
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
          .json({ message: "Email invalide" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Mot de passe invalide" });
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

      return res.status(200).json({
        message: "Connexion réussie",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // Récupérer les informations du profil de l'utilisateur connecté
  static async getProfile(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User);

    try {
      // Trouver l'utilisateur connecté à partir de l'ID stocké dans `req.user`
      const user = await userRepository.findOne({
        where: { id: req.user?.id },
      });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Retourner les informations de l'utilisateur
      return res.status(200).json({
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // Changer le mot de passe de l'utilisateur connecté
  static async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Assurez-vous que l'utilisateur est authentifié et que son ID est disponible

    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Vérifier l'ancien mot de passe
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Ancien mot de passe incorrect" });
      }

      // Hash du nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await AppDataSource.getRepository(User).save(user);

      return res
        .status(200)
        .json({ message: "Mot de passe changé avec succès" });
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // Demande de réinitialisation du mot de passe
  static async requestPasswordReset(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "L'email est requis" });
    }

    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { email },
      });

      if (!user) {
        // Pour des raisons de sécurité, ne pas indiquer si l'utilisateur existe ou non
        return res.status(200).json({ 
          message: "Si un compte existe avec cet email, un lien de réinitialisation sera envoyé." 
        });
      }

      // Générer un jeton unique pour la réinitialisation
      const resetToken = uuidv4();
      user.resetToken = resetToken;
      user.resetTokenExpiration = new Date(Date.now() + 3600000); // Expire dans 1 heure

      await AppDataSource.getRepository(User).save(user);

      // Utiliser FRONTEND_URL depuis les variables d'environnement
      const frontendUrl = process.env.FRONTEND_URL || 'https://admin-frontend-omega.vercel.app';
      const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

      try {
        await sendResetEmail(user.email, resetLink);
        return res.status(200).json({ 
          message: "Si un compte existe avec cet email, un lien de réinitialisation sera envoyé." 
        });
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
        // Annuler les changements en base de données si l'email n'a pas pu être envoyé
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await AppDataSource.getRepository(User).save(user);
        throw emailError;
      }
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation:", error);
      return res.status(500).json({ 
        message: "Une erreur est survenue lors de la demande de réinitialisation" 
      });
    }
  }

  // Réinitialisation du mot de passe
  static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          resetToken: token,
          resetTokenExpiration: MoreThan(new Date()),
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Jeton invalide ou expiré" });
      }

      // Mettre à jour le mot de passe et supprimer le jeton de réinitialisation
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;

      await AppDataSource.getRepository(User).save(user);

      return res
        .status(200)
        .json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default AuthController;
