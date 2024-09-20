// src/controllers/NotificationController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";

class NotificationController {
  static async getAll(req: Request, res: Response) {
    const notificationRepository = AppDataSource.getRepository(Notification);
    const notifications = await notificationRepository.find({
      order: { createdAt: "DESC" },
    });
    res.json(notifications);
  }

  static async create(req: Request, res: Response) {
    const notificationRepository = AppDataSource.getRepository(Notification);
    const { message, isUrgent } = req.body;

    const notification = new Notification();
    notification.message = message;
    notification.isUrgent = isUrgent;

    try {
      await notificationRepository.save(notification);
      res.status(201).json({ message: "Notification créée avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la création de la notification" });
    }
  }
}

export default NotificationController;
