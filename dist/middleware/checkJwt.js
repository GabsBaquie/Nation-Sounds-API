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
exports.checkJwt = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const checkJwt = (req, res, next) => {
    // Récupérer le token depuis le cookie
    let token = req.cookies.token;
    // Si le token n'est pas dans les cookies, essayer de le récupérer depuis les headers Authorization
    if (!token) {
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }
    if (!token) {
        return res.status(401).json({ message: "Non autorisé - Token manquant" });
    }
    let jwtPayload;
    try {
        jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
        return res.status(401).json({ message: "Non autorisé - Token invalide" });
    }
    // Optionnel : Rafraîchir le token si nécessaire
    const { userId, role, username, email } = jwtPayload;
    const newToken = jwt.sign({ userId, role, username, email }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
    res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 24 heures
    });
    next();
};
exports.checkJwt = checkJwt;
