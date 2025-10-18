// src/controllers/__tests__/PoiController.test.ts
import request from "supertest";
import app from "../../../src/index";
import { PoiService } from "../../../src/services/PoiService";
import { closeTestDB, initializeTestDB } from "../../../src/utils/testSetup";

describe("PoiController API", () => {
  beforeAll(async () => {
    await initializeTestDB();
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
      // Créer des POIs de différents types
      await PoiService.create({
        title: "Restaurant Test",
        description: "Un restaurant de test",
        latitude: 45.5017,
        longitude: -73.5673,
        type: "restaurant",
      });

      await PoiService.create({
        title: "Parking Test",
        description: "Un parking de test",
        latitude: 45.5017,
        longitude: -73.5673,
        type: "parking",
      });

      const res = await request(app)
        .get("/api/pois")
        .query({ type: "restaurant" });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/pois/:id", () => {
    it("devrait récupérer un POI par ID", async () => {
      const poi = await PoiService.create({
        title: "POI Test",
        description: "Description du POI test",
        latitude: 45.5017,
        longitude: -73.5673,
        type: "restaurant",
      });

      const res = await request(app).get(`/api/pois/${poi.id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("POI Test");
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
      const poiData = {
        title: "Nouveau POI",
        description: "Description du nouveau POI",
        latitude: 45.5017,
        longitude: -73.5673,
        type: "restaurant",
      };

      const res = await request(app).post("/api/pois").send(poiData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Nouveau POI");
    });

    it("devrait gérer les erreurs de création", async () => {
      const res = await request(app).post("/api/pois").send({}); // Données invalides

      expect(res.status).toBe(500);
    });
  });

  describe("PUT /api/pois/:id", () => {
    it("devrait mettre à jour un POI existant", async () => {
      const poi = await PoiService.create({
        title: "POI à Mettre à Jour",
        description: "Description initiale",
        latitude: 45.5017,
        longitude: -73.5673,
        type: "restaurant",
      });

      const updateData = {
        title: "POI Mis à Jour",
        description: "Description mise à jour",
        latitude: 45.5017,
        longitude: -73.5673,
        type: "parking",
      };

      const res = await request(app)
        .put(`/api/pois/${poi.id}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("POI Mis à Jour");
      expect(res.body.type).toBe("parking");
    });

    it("devrait retourner 404 pour un POI inexistant", async () => {
      const res = await request(app).put("/api/pois/9999").send({
        title: "POI Inexistant",
        description: "Description",
        latitude: 45.5017,
        longitude: -73.5673,
        type: "restaurant",
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "POI non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).put("/api/pois/invalid").send({
        title: "POI",
        description: "Description",
        latitude: 45.5017,
        longitude: -73.5673,
        type: "restaurant",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de POI invalide");
    });
  });

  describe("DELETE /api/pois/:id", () => {
    it("devrait supprimer un POI existant", async () => {
      const poi = await PoiService.create({
        title: "POI à Supprimer",
        description: "Description à supprimer",
        latitude: 45.5017,
        longitude: -73.5673,
        type: "restaurant",
      });

      const res = await request(app).delete(`/api/pois/${poi.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "POI supprimé avec succès");
    });

    it("devrait retourner 404 pour un POI inexistant", async () => {
      const res = await request(app).delete("/api/pois/9999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "POI non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).delete("/api/pois/invalid");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de POI invalide");
    });
  });
});
