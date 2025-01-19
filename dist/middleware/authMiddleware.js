"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "Non autorisé - Token manquant" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Ajouter les informations décodées du token à la requête
        req.user = {
            id: decoded.userId,
            role: decoded.role,
            username: decoded.username,
            email: decoded.email,
        };
        next(); // Continuer avec la requête
    }
    catch (err) {
        return res.status(401).json({ message: "Token invalide" });
    }
};
exports.authMiddleware = authMiddleware;
