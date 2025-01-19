"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts ou src/server.ts
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const data_source_1 = require("./data-source");
const routes_1 = __importDefault(require("./routes"));
require("reflect-metadata");
const app = (0, express_1.default)();
// Configuration CORS
app.use((0, cors_1.default)({
    origin: [
        "*"
        // "https://admin-frontend-omega.vercel.app", // Remplacez par votre URL frontend
        // "nation-sounds-api-e56de4388c86.herokuapp.com", // test heroku
        // "http://localhost:4000", // Pour le développement local
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
}));
// Middlewares
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api", routes_1.default);
// Connexion à la base de données et démarrage du serveur
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Connexion à la base de données réussie !");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("Erreur lors de la connexion à la base de données :", error);
});
