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
exports.adminMiddleware = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res
                .status(401)
                .json({ message: "Non autorisé - Utilisateur non identifié" });
        }
        const foundUser = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
            where: { id: userId },
        });
        if (foundUser && foundUser.role === "admin") {
            next();
        }
        else {
            res.status(403).json({ message: "Accès interdit - Admin seulement" });
        }
    }
    catch (error) {
        console.error("Erreur lors de la vérification du rôle de l'utilisateur:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
exports.adminMiddleware = adminMiddleware;
