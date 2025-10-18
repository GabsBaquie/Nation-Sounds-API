// src/controllers/__tests__/DayController.test.ts
import request from "supertest";
import app from "../../index";
import { DayService } from "../../services/DayService";
import { closeTestDB, initializeTestDB } from "../../utils/testSetup";

describe("DayController API", () => {
  beforeAll(async () => {
    await initializeTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("GET /api/days", () => {
    it("devrait récupérer tous les jours", async () => {
      const res = await request(app).get("/api/days");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/days/:id", () => {
    it("devrait récupérer un jour par ID", async () => {
      const day = await DayService.create({
        title: "Jour Test",
        date: "2024-12-31",
      });

      const res = await request(app).get(`/api/days/${day!.id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Jour Test");
    });

    it("devrait retourner 404 pour un jour inexistant", async () => {
      const res = await request(app).get("/api/days/9999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Jour non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).get("/api/days/invalid");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de jour invalide");
    });
  });

  describe("POST /api/days", () => {
    it("devrait créer un nouveau jour", async () => {
      const dayData = {
        title: "Nouveau Jour",
        date: "2024-12-31",
      };

      const res = await request(app).post("/api/days").send(dayData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Nouveau Jour");
    });

    it("devrait gérer les erreurs de création", async () => {
      const res = await request(app).post("/api/days").send({}); // Données invalides

      expect(res.status).toBe(500);
    });
  });

  describe("PUT /api/days/:id", () => {
    it("devrait mettre à jour un jour existant", async () => {
      const day = await DayService.create({
        title: "Jour à Mettre à Jour",
        date: "2024-12-31",
      });

      const updateData = {
        title: "Jour Mis à Jour",
        date: "2024-12-31",
      };

      const res = await request(app)
        .put(`/api/days/${day!.id}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Jour Mis à Jour");
    });

    it("devrait retourner 404 pour un jour inexistant", async () => {
      const res = await request(app).put("/api/days/9999").send({
        title: "Jour Inexistant",
        date: "2024-12-31",
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Jour non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).put("/api/days/invalid").send({
        title: "Jour",
        date: "2024-12-31",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de jour invalide");
    });
  });

  describe("DELETE /api/days/:id", () => {
    it("devrait supprimer un jour existant", async () => {
      const day = await DayService.create({
        title: "Jour à Supprimer",
        date: "2024-12-31",
      });

      const res = await request(app).delete(`/api/days/${day!.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Jour supprimé avec succès");
    });

    it("devrait retourner 404 pour un jour inexistant", async () => {
      const res = await request(app).delete("/api/days/9999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Jour non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).delete("/api/days/invalid");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de jour invalide");
    });
  });

  describe("PUT /api/days/:id/concerts", () => {
    it("devrait ajouter des concerts à un jour", async () => {
      const day = await DayService.create({
        title: "Jour avec Concerts",
        date: "2024-12-31",
      });

      // Créer des concerts pour les ajouter
      const concert1 = await DayService.create({
        title: "Concert 1",
        date: "2024-12-31",
      });

      const concert2 = await DayService.create({
        title: "Concert 2",
        date: "2024-12-31",
      });

      const res = await request(app)
        .put(`/api/days/${day!.id}/concerts`)
        .send({
          concertIds: [concert1!.id, concert2!.id],
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", day!.id);
    });

    it("devrait retourner 400 pour des IDs de concerts invalides", async () => {
      const day = await DayService.create({
        title: "Jour Test",
        date: "2024-12-31",
      });

      const res = await request(app)
        .put(`/api/days/${day!.id}/concerts`)
        .send({
          concertIds: ["invalid", "also-invalid"],
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Liste d'IDs de concerts invalide"
      );
    });

    it("devrait retourner 404 pour un jour inexistant", async () => {
      const res = await request(app)
        .put("/api/days/9999/concerts")
        .send({
          concertIds: [1, 2],
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Jour non trouvé");
    });
  });

  describe("GET /api/days/date-range", () => {
    it("devrait récupérer les jours dans une plage de dates", async () => {
      const res = await request(app).get("/api/days/date-range").query({
        start: "2024-12-01",
        end: "2024-12-31",
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait retourner 400 si les dates sont manquantes", async () => {
      const res = await request(app).get("/api/days/date-range");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Dates de début et de fin requises"
      );
    });

    it("devrait retourner 400 pour des dates invalides", async () => {
      const res = await request(app).get("/api/days/date-range").query({
        start: "invalid-date",
        end: "also-invalid",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Format de date invalide");
    });
  });
});
