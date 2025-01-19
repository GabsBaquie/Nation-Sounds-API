"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res
                .status(401)
                .json({ message: "Non autorisé - Utilisateur non identifié" });
        }
        if (!roles.includes(user.role)) {
            return res
                .status(403)
                .json({ message: "Accès interdit - Rôle insuffisant" });
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
