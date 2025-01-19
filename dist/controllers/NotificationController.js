"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const Notification_1 = require("../entity/Notification");
class NotificationController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationRepository = data_source_1.AppDataSource.getRepository(Notification_1.Notification);
            const notifications = yield notificationRepository.find({
                order: { createdAt: "DESC" },
            });
            res.json(notifications);
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationRepository = data_source_1.AppDataSource.getRepository(Notification_1.Notification);
            const { message, isUrgent } = req.body;
            const notification = new Notification_1.Notification();
            notification.message = message;
            notification.isUrgent = isUrgent;
            try {
                yield notificationRepository.save(notification);
                res.status(201).json({ message: "Notification créée avec succès" });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Erreur lors de la création de la notification" });
            }
        });
    }
}
exports.default = NotificationController;
