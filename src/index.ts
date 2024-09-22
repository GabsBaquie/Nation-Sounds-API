// src/index.ts ou src/server.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { AppDataSource } from "./data-source";
import routes from "./routes";

const app = express();

// Configuration CORS
app.use(
  cors({
    origin: [
      "https://admin-frontend-omega.vercel.app", // Remplacez par votre URL frontend
      "http://localhost:3000", // Pour le développement local
    ],
    credentials: true, // Permet l'envoi de cookies
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
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port http://localhost:3000${PORT}`);
    });
  })
  .catch((error) => console.log(error));
