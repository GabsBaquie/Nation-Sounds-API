// src/index.ts ou src/server.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import routes from "./routes";

const app = express();

// Configuration CORS
app.use(
  cors({
    origin: [
      "https://admin-frontend-omega.vercel.app", // Frontend de production
      "http://localhost:3000", // frontend de développement local
      "http://localhost:3001", // frontend de développement local 2
      "https://nation-sounds-backend.up.railway.app", // Backend de production
      "http://localhost:8080", // Backend de développement local
      "http://51.15.241.119:8080", // Backend de production
    ],
    credentials: true, // Permet l'envoi de cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes autorisées
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ], // En-têtes autorisés
    exposedHeaders: ["Set-Cookie"], // Permet l'accès aux cookies dans le frontend
  })
);

// Middlewares de sécurité
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser());

// Log la taille du body pour chaque requête (debug 413)
app.use((req, res, next) => {
  const len = req.headers["content-length"];
  console.log(`Requête ${req.method} ${req.url} - Content-Length: ${len}`);
  next();
});

// Routes
app.use("/api", routes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connexion à la base de données et lancement du serveur uniquement en dehors de NODE_ENV=test
if (process.env.NODE_ENV !== "test") {
  AppDataSource.initialize()
    .then(() => {
      console.log("Connexion à la base de données réussie !");
      const PORT = parseInt(process.env.PORT ?? "8080", 10);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
      });
    })
    .catch((error: Error) => {
      console.error(
        "Erreur lors de la connexion à la base de données :",
        error
      );
    });
}

export default app;
