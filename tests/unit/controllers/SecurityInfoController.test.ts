import request from "supertest";
import { CreateSecurityInfoDto } from "../../../src/dto/requests/create-security-info.dto";
import app from "../../../src/index";
import { SecurityInfoService } from "../../../src/services/SecurityInfoService";
import {
  closeTestDB,
  createAdminUser,
  initializeTestDB,
} from "../../../src/utils/testSetup";

describe("SecurityInfoController API", () => {
  let adminToken: string;

  beforeAll(async () => {
    await initializeTestDB();
    adminToken = await createAdminUser();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("GET /api/securityInfos", () => {
    it("devrait récupérer toutes les informations de sécurité", async () => {
      const res = await request(app).get("/api/securityInfos");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/securityInfos/:id", () => {
    it("devrait récupérer une information de sécurité par ID", async () => {
      const securityData: CreateSecurityInfoDto = {
        title: "Info Test",
        description: "Description de l'info",
        urgence: false,
        actif: true,
      };
      const security = await SecurityInfoService.create(securityData);
      const res = await request(app).get(`/api/securityInfos/${security.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", security.id);
    });

    it("devrait retourner 404 pour une information inexistante", async () => {
      const res = await request(app).get("/api/securityInfos/9999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "message",
        "Information de sécurité non trouvée"
      );
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).get("/api/securityInfos/invalid");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "ID d'information de sécurité invalide"
      );
    });
  });

  describe("POST /api/securityInfos", () => {
    it("devrait créer une nouvelle information de sécurité", async () => {
      const securityData: CreateSecurityInfoDto = {
        title: "Nouvelle Info",
        description: "Description de la nouvelle info",
        urgence: true,
        actif: true,
      };
      const res = await request(app)
        .post("/api/securityInfos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(securityData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Nouvelle Info");
    });

    it("devrait créer une info de sécurité sans token (pas d'auth requise)", async () => {
      const securityData: CreateSecurityInfoDto = {
        title: "Info Sans Token",
        description: "Description",
        urgence: false,
        actif: true,
      };
      const res = await request(app)
        .post("/api/securityInfos")
        .send(securityData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
    });

    it("devrait retourner 400 pour des données invalides", async () => {
      const res = await request(app)
        .post("/api/securityInfos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({}); // Données invalides
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/securityInfos/:id", () => {
    it("devrait mettre à jour une information de sécurité existante", async () => {
      const securityData: CreateSecurityInfoDto = {
        title: "Info Originale",
        description: "Description originale",
        urgence: false,
        actif: true,
      };
      const security = await SecurityInfoService.create(securityData);
      const updateData: CreateSecurityInfoDto = {
        title: "Info Modifiée",
        description: "Description modifiée",
        urgence: true,
        actif: false,
      };
      const res = await request(app)
        .put(`/api/securityInfos/${security.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", updateData.title);
    });

    it("devrait retourner 404 pour une information inexistante", async () => {
      const updateData: CreateSecurityInfoDto = {
        title: "Info Inexistante",
        description: "Description",
        urgence: false,
        actif: true,
      };
      const res = await request(app)
        .put("/api/securityInfos/9999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "message",
        "Information de sécurité non trouvée"
      );
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const updateData: CreateSecurityInfoDto = {
        title: "Info Invalide",
        description: "Description",
        urgence: false,
        actif: true,
      };
      const res = await request(app)
        .put("/api/securityInfos/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "ID d'information de sécurité invalide"
      );
    });
  });

  describe("DELETE /api/securityInfos/:id", () => {
    it("devrait supprimer une information de sécurité existante", async () => {
      const securityData: CreateSecurityInfoDto = {
        title: "Info à Supprimer",
        description: "Description",
        urgence: false,
        actif: true,
      };
      const security = await SecurityInfoService.create(securityData);
      const res = await request(app)
        .delete(`/api/securityInfos/${security.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Information de sécurité supprimée avec succès"
      );
    });

    it("devrait retourner 404 pour une information inexistante", async () => {
      const res = await request(app)
        .delete("/api/securityInfos/9999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty(
        "message",
        "Information de sécurité non trouvée"
      );
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app)
        .delete("/api/securityInfos/invalid")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "ID d'information de sécurité invalide"
      );
    });
  });
});
