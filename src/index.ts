// src/index.ts ou src/server.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import "reflect-metadata";

const app = express();

// Configuration CORS
app.use(
  cors({
    origin: [
      "*"
      // "https://admin-frontend-omega.vercel.app", // Remplacez par votre URL frontend
      // "nation-sounds-api-e56de4388c86.herokuapp.com", // test heroku
      // "http://localhost:4000", // Pour le développement local
    ],
    credentials: true, // Permet l'envoi de cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
  })
);

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", routes);

// Connexion à la base de données et démarrage du serveur
AppDataSource.initialize()
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
