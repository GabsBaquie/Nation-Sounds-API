// src/middleware/__tests__/authMiddleware.test.ts
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.docker" });
  console.log("Chargement de .env.docker");
} else {
  dotenv.config();
  console.log("Chargement de .env");
}

import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { checkJwt } from "../../../src/middleware/checkJwt";
import {
  closeTestDB,
  createAdminUser,
  initializeTestDB,
} from "../../../src/utils/testSetup";

// Créer une application Express de test avec cookie-parser
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/protected", checkJwt, (req: Request, res: Response) => {
  res.status(200).json({ message: "Accès autorisé" });
});

let adminToken: string;

describe("Auth Middleware", () => {
  beforeAll(async () => {
    await initializeTestDB(); // Initialiser la base de données de test
    adminToken = await createAdminUser(); // Récupérer le token administrateur
  });

  afterAll(async () => {
    await closeTestDB(); // Fermer la connexion à la base de données après les tests
  });

  it("devrait accorder l'accès avec un token valide", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Accès autorisé");
  });

  it("devrait refuser l'accès sans token", async () => {
    const res = await request(app).get("/protected");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Non autorisé - Token manquant");
  });

  it("devrait refuser l'accès avec un token invalide", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalide");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Non autorisé - Token invalide"); // Mise à jour ici
  });

  it("devrait refuser l'accès avec un token expiré", async () => {
    const expiredToken = jwt.sign(
      {
        id: 1,
        role: "admin",
        username: "adminuser",
        email: "admin@example.com",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "-1h" } // Token expiré
    );

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Non autorisé - Token invalide"); // Mise à jour ici
  });
});
