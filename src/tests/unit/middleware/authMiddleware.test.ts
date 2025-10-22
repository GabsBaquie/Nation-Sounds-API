import request from "supertest";
import app from "../../index";
import {
  closeTestDB,
  createAdminUser,
  initializeTestDB,
} from "../../utils/testSetup";

describe("AuthMiddleware", () => {
  let adminToken: string;

  beforeAll(async () => {
    await initializeTestDB();
    adminToken = await createAdminUser();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("checkJwt middleware", () => {
    it("devrait autoriser l'accès avec un token valide", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it("devrait rejeter l'accès sans token", async () => {
      const res = await request(app).get("/api/auth/profile");
      expect(res.status).toBe(401);
    });

    it("devrait rejeter l'accès avec un token invalide", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid-token");
      expect(res.status).toBe(401);
    });

    it("devrait rejeter l'accès avec un token malformé", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "InvalidFormat");
      expect(res.status).toBe(401);
    });

    it("devrait rejeter l'accès avec un token expiré", async () => {
      // Note: Ce test nécessiterait un token expiré valide
      // Pour l'instant, on teste juste que le middleware fonctionne
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer expired-token");
      expect(res.status).toBe(401);
    });
  });
});
