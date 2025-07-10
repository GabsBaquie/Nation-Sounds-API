import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import routes from "./routes";

const app = express();

// Liste des origines autorisées
const allowedOrigins = [
  "https://admin-frontend-omega.vercel.app",
  "https://nation-sound-front.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8080",
  "http://51.15.241.119:8080",
];

// Configuration CORS améliorée
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS bloqué pour l'origine:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "X-API-Key",
      "Cache-Control",
    ],
    exposedHeaders: ["Set-Cookie", "Content-Length", "Content-Type"],
    maxAge: 86400,
  })
);

// Middlewares de sécurité
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Pré-traitements
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// Middleware OPTIONS pour les preflight requests
app.options("*", cors());

// Debug : log les requêtes entrantes
app.use((req, res, next) => {
  console.log(
    `➡️ ${req.method} ${req.url} | Content-Length: ${req.headers["content-length"]} | Origin: ${req.headers.origin}`
  );
  next();
});

// Routes principales
app.use("/api", routes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Gestion des erreurs CORS
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.message === "Not allowed by CORS") {
      return res.status(403).json({
        error: "CORS error",
        message: "Origin not allowed",
        origin: req.headers.origin,
      });
    }
    next(err);
  }
);

// Démarrage du serveur
if (process.env.NODE_ENV !== "test") {
  AppDataSource.initialize()
    .then(() => {
      console.log("✅ Connexion à la base de données réussie !");
      const PORT = parseInt(process.env.PORT ?? "8080", 10);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
        console.log("🌐 CORS autorisé pour :", allowedOrigins);
      });
    })
    .catch((error: Error) => {
      console.error("❌ Erreur DB :", error);
    });
}

export default app;
