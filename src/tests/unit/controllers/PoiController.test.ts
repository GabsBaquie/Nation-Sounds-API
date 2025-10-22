import request from "supertest";
import { CreatePoiDto } from "../../dto/requests/create-poi.dto";
import app from "../../index";
import { PoiService } from "../../services/PoiService";
import {
  closeTestDB,
  createAdminUser,
  initializeTestDB,
} from "../../utils/testSetup";

describe("PoiController API", () => {
  let adminToken: string;

  beforeAll(async () => {
    await initializeTestDB();
    adminToken = await createAdminUser();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("GET /api/pois", () => {
    it("devrait récupérer tous les POIs", async () => {
      const res = await request(app).get("/api/pois");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait filtrer les POIs par type", async () => {
      const res = await request(app)
        .get("/api/pois")
        .query({ type: "restaurant" });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/pois/:id", () => {
    it("devrait récupérer un POI par ID", async () => {
      const poiData: CreatePoiDto = {
        title: "POI Test",
        type: "restaurant",
        latitude: 48.8566,
        longitude: 2.3522,
      };
      const poi = await PoiService.create(poiData);
      const res = await request(app).get(`/api/pois/${poi.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", poi.id);
    });

    it("devrait retourner 404 pour un POI inexistant", async () => {
      const res = await request(app).get("/api/pois/9999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Point d'intérêt non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).get("/api/pois/invalid");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de POI invalide");
    });
  });

  describe("POST /api/pois", () => {
    it("devrait créer un nouveau POI", async () => {
      const poiData: CreatePoiDto = {
        title: "Nouveau POI",
        type: "restaurant",
        latitude: 48.8566,
        longitude: 2.3522,
        description: "Description du POI",
      };
      const res = await request(app)
        .post("/api/pois")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(poiData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Nouveau POI");
    });

    it("devrait créer un POI sans token (pas d'auth requise)", async () => {
      const poiData: CreatePoiDto = {
        title: "POI Sans Token",
        type: "restaurant",
        latitude: 48.8566,
        longitude: 2.3522,
      };
      const res = await request(app).post("/api/pois").send(poiData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
    });

    it("devrait retourner 400 pour des données invalides", async () => {
      const res = await request(app)
        .post("/api/pois")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({}); // Données invalides
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/pois/:id", () => {
    it("devrait mettre à jour un POI existant", async () => {
      const poiData: CreatePoiDto = {
        title: "POI Original",
        type: "restaurant",
        latitude: 48.8566,
        longitude: 2.3522,
      };
      const poi = await PoiService.create(poiData);
      const updateData: CreatePoiDto = {
        title: "POI Modifié",
        type: "restaurant",
        latitude: 48.8566,
        longitude: 2.3522,
      };
      const res = await request(app)
        .put(`/api/pois/${poi.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", updateData.title);
    });

    it("devrait retourner 404 pour un POI inexistant", async () => {
      const updateData: CreatePoiDto = {
        title: "POI Inexistant",
        type: "restaurant",
        latitude: 48.8566,
        longitude: 2.3522,
      };
      const res = await request(app)
        .put("/api/pois/9999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Point d'intérêt non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const updateData: CreatePoiDto = {
        title: "POI Invalide",
        type: "restaurant",
        latitude: 48.8566,
        longitude: 2.3522,
      };
      const res = await request(app)
        .put("/api/pois/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de POI invalide");
    });
  });

  describe("DELETE /api/pois/:id", () => {
    it("devrait supprimer un POI existant", async () => {
      const poiData: CreatePoiDto = {
        title: "POI à Supprimer",
        type: "restaurant",
        latitude: 48.8566,
        longitude: 2.3522,
      };
      const poi = await PoiService.create(poiData);
      const res = await request(app)
        .delete(`/api/pois/${poi.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "POI supprimé avec succès");
    });

    it("devrait retourner 404 pour un POI inexistant", async () => {
      const res = await request(app)
        .delete("/api/pois/9999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Point d'intérêt non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app)
        .delete("/api/pois/invalid")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de POI invalide");
    });
  });
});
