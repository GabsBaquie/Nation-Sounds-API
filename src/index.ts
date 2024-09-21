// src/index.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import routes from "./routes";

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    const app = express();

    // Middlewares de sécurité
    app.use(helmet());

    // Configuration de CORS pour permettre l'envoi de cookies
    app.use(
      cors({
        origin: "https://admin-frontend-omega.vercel.app/",
        credentials: true, // Autoriser l'envoi de cookies
      })
    );

    app.use(express.json());
    app.use(cookieParser());

    // Routes
    app.use("/api", routes);

    // Démarrer le serveur
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log(
      "Erreur lors de l'initialisation de la source de données",
      error
    )
  );
