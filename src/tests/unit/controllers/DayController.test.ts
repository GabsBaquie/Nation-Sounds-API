import request from "supertest";
import { CreateConcertDto } from "../../dto/requests/create-concert.dto";
import { CreateDayDto } from "../../dto/requests/create-day.dto";
import app from "../../index";
import { ConcertService } from "../../services/ConcertService";
import { DayService } from "../../services/DayService";
import {
  closeTestDB,
  createAdminUser,
  initializeTestDB,
} from "../../utils/testSetup";

describe("DayController API", () => {
  let adminToken: string;

  beforeAll(async () => {
    await initializeTestDB();
    adminToken = await createAdminUser();
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
      const dayData: CreateDayDto = {
        title: "Jour Test",
        date: "2024-12-31",
      };
      const day = await DayService.create(dayData);
      expect(day).not.toBeNull();
      const res = await request(app).get(`/api/days/${day!.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", day!.id);
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
      const dayData: CreateDayDto = {
        title: "Nouveau Jour",
        date: "2024-01-01",
      };
      const res = await request(app)
        .post("/api/days")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(dayData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Nouveau Jour");
    });

    it("devrait retourner 401 sans token", async () => {
      const dayData: CreateDayDto = {
        title: "Jour Sans Token",
        date: "2024-01-01",
      };
      const res = await request(app).post("/api/days").send(dayData);
      expect(res.status).toBe(401);
    });

    it("devrait retourner 400 pour des données invalides", async () => {
      const res = await request(app)
        .post("/api/days")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({}); // Données invalides
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/days/:id", () => {
    it("devrait mettre à jour un jour existant", async () => {
      const dayData: CreateDayDto = {
        title: "Jour Original",
        date: "2024-01-01",
      };
      const day = await DayService.create(dayData);
      expect(day).not.toBeNull();
      const updateData: CreateDayDto = {
        title: "Jour Modifié",
        date: "2024-01-02",
      };
      const res = await request(app)
        .put(`/api/days/${day!.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", updateData.title);
    });

    it("devrait retourner 404 pour un jour inexistant", async () => {
      const updateData: CreateDayDto = {
        title: "Jour Inexistant",
        date: "2024-01-01",
      };
      const res = await request(app)
        .put("/api/days/9999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Jour non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const updateData: CreateDayDto = {
        title: "Jour Invalide",
        date: "2024-01-01",
      };
      const res = await request(app)
        .put("/api/days/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de jour invalide");
    });
  });

  describe("DELETE /api/days/:id", () => {
    it("devrait supprimer un jour existant", async () => {
      const dayData: CreateDayDto = {
        title: "Jour à Supprimer",
        date: "2024-01-01",
      };
      const day = await DayService.create(dayData);
      expect(day).not.toBeNull();
      const res = await request(app)
        .delete(`/api/days/${day!.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Jour supprimé avec succès");
    });

    it("devrait retourner 404 pour un jour inexistant", async () => {
      const res = await request(app)
        .delete("/api/days/9999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Jour non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app)
        .delete("/api/days/invalid")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de jour invalide");
    });
  });

  describe("PUT /api/days/:id/concerts", () => {
    it("devrait ajouter des concerts à un jour", async () => {
      const dayData: CreateDayDto = {
        title: "Jour avec Concerts",
        date: "2024-01-01",
      };
      const day = await DayService.create(dayData);
      expect(day).not.toBeNull();
      const concert1Data: CreateConcertDto = {
        title: "Concert 1",
        description: "Description 1",
        performer: "Artiste 1",
        time: "18:00",
        location: "Lieu 1",
      };
      const concert1 = await ConcertService.create(concert1Data);
      expect(concert1).not.toBeNull();
      const concert2Data: CreateConcertDto = {
        title: "Concert 2",
        description: "Description 2",
        performer: "Artiste 2",
        time: "20:00",
        location: "Lieu 2",
      };
      const concert2 = await ConcertService.create(concert2Data);
      expect(concert2).not.toBeNull();
      const res = await request(app)
        .put(`/api/days/${day!.id}/concerts`)
        .send({
          concertIds: [concert1!.id, concert2!.id],
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Concerts ajoutés avec succès"
      );
    });
  });

  describe("GET /api/days/date-range", () => {
    it("devrait récupérer les jours dans une plage de dates", async () => {
      const res = await request(app).get("/api/days/date-range").query({
        start: "2024-01-01",
        end: "2024-12-31",
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait retourner 400 si les paramètres de date sont manquants", async () => {
      const res = await request(app).get("/api/days/date-range");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Dates de début et de fin requises"
      );
    });
  });
});
