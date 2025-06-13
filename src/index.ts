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
      "https://admin-frontend-omega.vercel.app", // Frontend de production
      "http://localhost:3000", // frontend de développement local
      "https://nation-sounds-backend.up.railway.app", // Backend de production
      "http://localhost:4000", // Backend de développement local
    ],
    credentials: true, // Permet l'envoi de cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"], // En-têtes autorisés
    exposedHeaders: ["Set-Cookie"], // Permet l'accès aux cookies dans le frontend
  })
);

// Middlewares de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", routes);

// Connexion à la base de données et lancement du serveur uniquement en dehors de NODE_ENV=test
if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize()
    .then(() => {
      console.log('Connexion à la base de données réussie !');
      const PORT = process.env.PORT || 4000;
      app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
      });
    })
    .catch((error: Error) => {
      console.error('Erreur lors de la connexion à la base de données :', error);
    });
}

export default app;
