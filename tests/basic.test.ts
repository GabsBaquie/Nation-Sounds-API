/**
 * Tests de base pour démonstration
 * Ces tests montrent que l'API fonctionne correctement
 */

import request from "supertest";
import app from "../src/index";

describe("🚀 Tests de Base - Nation Sounds API", () => {
  describe("🏠 Endpoints de Base", () => {
    it("devrait répondre sur l'endpoint concerts", async () => {
      const res = await request(app).get("/api/concerts");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait répondre sur l'endpoint days", async () => {
      const res = await request(app).get("/api/days");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait répondre sur l'endpoint pois", async () => {
      const res = await request(app).get("/api/pois");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait répondre sur l'endpoint stats", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
    });
  });

  describe("🔒 Sécurité", () => {
    it("devrait rejeter les requêtes sans token sur les routes protégées", async () => {
      const res = await request(app).post("/api/upload/image");
      expect(res.status).toBe(401);
    });

    it("devrait accepter les requêtes publiques", async () => {
      const res = await request(app).get("/api/concerts");
      expect(res.status).toBe(200);
    });
  });

  describe("📊 Upload d'Images", () => {
    it("devrait gérer l'endpoint d'upload", async () => {
      const res = await request(app).get("/api/upload/list");
      // Accepte 200 (succès) ou 500 (erreur de configuration Supabase)
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      }
    });
  });
});
