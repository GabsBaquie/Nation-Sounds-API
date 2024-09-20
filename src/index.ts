// src/index.ts
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

    // Middlewares
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    // Routes
    app.use("/api", routes);

    // Démarrer le serveur
    const PORT = process.env.PORT || 3000;
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
