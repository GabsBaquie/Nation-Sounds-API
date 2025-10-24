const express = require("express");
const cors = require("cors");

const app = express();

// Configuration CORS simple
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// Routes simples
app.get("/", (req, res) => {
  res.json({
    message: "Nation Sounds API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set"
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "API routes available!",
    routes: ["/api/auth", "/api/days", "/api/concerts", "/api/actualites", "/api/partenaires", "/api/pois", "/api/securityInfos", "/api/upload", "/api/stats"]
  });
});

module.exports = app;