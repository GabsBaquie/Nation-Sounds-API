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

    // Liste des origines autorisées
    const allowedOrigins = [
      "https://admin-frontend-omega.vercel.app",
      "http://localhost:3000",
    ];

    // Middleware CORS configuré dynamiquement
    app.use(
      cors({
        origin: function (origin, callback) {
          // Permettre les requêtes sans origin (ex: mobile apps, curl)
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          } else {
            const msg =
              "La politique CORS pour ce site ne permet pas l'accès depuis cette origine.";
            return callback(new Error(msg), false);
          }
        },
        credentials: true, // Autoriser l'envoi de cookies
      })
    );

    // Middlewares de sécurité et parsage
    app.use(helmet());
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
