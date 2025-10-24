const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Liste des origines autorisées
const allowedOrigins = [
  "https://admin-frontend-omega.vercel.app",
  "https://nation-sound-front.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
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

// Import des routes (nous allons les créer)
const authRoutes = require("./routes/auth");
const dayRoutes = require("./routes/days");
const concertRoutes = require("./routes/concerts");
const actualiteRoutes = require("./routes/actualites");
const partenaireRoutes = require("./routes/partenaires");
const poiRoutes = require("./routes/pois");
const securityInfoRoutes = require("./routes/securityInfos");
const uploadRoutes = require("./routes/upload");
const statsRoutes = require("./routes/stats");

// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/pois", poiRoutes);
app.use("/api/days", dayRoutes);
app.use("/api/concerts", concertRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/securityInfos", securityInfoRoutes);
app.use("/api/actualites", actualiteRoutes);
app.use("/api/partenaires", partenaireRoutes);
app.use("/api/stats", statsRoutes);

// Route pour récupérer toutes les données
app.get("/api", async (req, res) => {
  try {
    const { Pool } = require("pg");

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });

    console.log("Début de la récupération des données...");

    // Récupérer toutes les données
    const [
      daysResult,
      concertsResult,
      poisResult,
      securityInfosResult,
      actualitesResult,
      partenairesResult,
    ] = await Promise.all([
      pool.query(`
        SELECT
          d.*,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', c.id,
                'title', c.title,
                'description', c.description,
                'performer', c.performer,
                'time', c.time,
                'location', c.location,
                'image', c.image,
                'created_at', c.created_at,
                'updated_at', c.updated_at
              )
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'::json
          ) as concerts
        FROM day d
        LEFT JOIN concert_days_day cd ON d.id = cd."dayId"
        LEFT JOIN concert c ON cd."concertId" = c.id
        GROUP BY d.id
        ORDER BY d.date ASC
      `),
      pool.query(`
        SELECT
          c.*,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', d.id,
                'title', d.title,
                'date', d.date,
                'created_at', d.created_at,
                'updated_at', d.updated_at
              )
            ) FILTER (WHERE d.id IS NOT NULL),
            '[]'::json
          ) as days
        FROM concert c
        LEFT JOIN concert_days_day cd ON c.id = cd."concertId"
        LEFT JOIN day d ON cd."dayId" = d.id
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `),
      pool.query("SELECT * FROM poi ORDER BY created_at DESC"),
      pool.query("SELECT * FROM security_info ORDER BY created_at DESC"),
      pool.query("SELECT * FROM actualite ORDER BY created_at DESC"),
      pool.query("SELECT * FROM partenaire ORDER BY created_at DESC"),
    ]);

    const data = {
      days: daysResult.rows,
      concerts: concertsResult.rows,
      pois: poisResult.rows,
      securityInfos: securityInfosResult.rows,
      actualites: actualitesResult.rows,
      partenaires: partenairesResult.rows,
    };

    console.log("Données récupérées avec succès");
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

// Route de test
app.get("/", (req, res) => {
  res.json({
    message: "Nation Sounds API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
  });
});

// Gestion des erreurs CORS
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS error",
      message: "Origin not allowed",
      origin: req.headers.origin,
    });
  }
  next(err);
});

module.exports = app;
