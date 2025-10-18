// src/controllers/__tests__/ConcertController.test.ts
import request from "supertest";
import app from "../../index";
import { ConcertService } from "../../services/ConcertService";
import { closeTestDB, initializeTestDB } from "../../utils/testSetup";

describe("ConcertController API", () => {
  beforeAll(async () => {
    await initializeTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("GET /api/concerts", () => {
    it("devrait récupérer tous les concerts", async () => {
      const res = await request(app).get("/api/concerts");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/concerts/:id", () => {
    it("devrait récupérer un concert par ID", async () => {
      const concert = await ConcertService.create({
        title: "Concert Test",
        description: "Description du concert test",
        performer: "Artiste Test",
        time: "20:00",
        location: "Salle de concert",
        image: "test-image.jpg",
      });

      const res = await request(app).get(`/api/concerts/${concert!.id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Concert Test");
    });

    it("devrait retourner 404 pour un concert inexistant", async () => {
      const res = await request(app).get("/api/concerts/9999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Concert non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).get("/api/concerts/invalid");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de concert invalide");
    });
  });

  describe("POST /api/concerts", () => {
    it("devrait créer un nouveau concert", async () => {
      const concertData = {
        title: "Nouveau Concert",
        description: "Description du nouveau concert",
        performer: "Nouvel Artiste",
        time: "21:00",
        location: "Nouvelle salle",
        image: "new-image.jpg",
      };

      const res = await request(app).post("/api/concerts").send(concertData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Nouveau Concert");
    });

    it("devrait gérer les erreurs de création", async () => {
      const res = await request(app).post("/api/concerts").send({}); // Données invalides

      expect(res.status).toBe(500);
    });
  });

  describe("PUT /api/concerts/:id", () => {
    it("devrait mettre à jour un concert existant", async () => {
      const concert = await ConcertService.create({
        title: "Concert à Mettre à Jour",
        description: "Description initiale",
        performer: "Artiste Initial",
        time: "20:00",
        location: "Salle initiale",
        image: "initial-image.jpg",
      });

      const updateData = {
        title: "Concert Mis à Jour",
        description: "Description mise à jour",
        performer: "Artiste Mis à Jour",
        time: "21:00",
        location: "Nouvelle salle",
        image: "updated-image.jpg",
      };

      const res = await request(app)
        .put(`/api/concerts/${concert!.id}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Concert Mis à Jour");
    });

    it("devrait retourner 404 pour un concert inexistant", async () => {
      const res = await request(app).put("/api/concerts/9999").send({
        title: "Concert Inexistant",
        description: "Description",
        performer: "Artiste",
        time: "20:00",
        location: "Salle",
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Concert non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).put("/api/concerts/invalid").send({
        title: "Concert",
        description: "Description",
        performer: "Artiste",
        time: "20:00",
        location: "Salle",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de concert invalide");
    });
  });

  describe("DELETE /api/concerts/:id", () => {
    it("devrait supprimer un concert existant", async () => {
      const concert = await ConcertService.create({
        title: "Concert à Supprimer",
        description: "Description à supprimer",
        performer: "Artiste à Supprimer",
        time: "20:00",
        location: "Salle à supprimer",
        image: "delete-image.jpg",
      });

      const res = await request(app).delete(`/api/concerts/${concert!.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Concert supprimé avec succès"
      );
    });

    it("devrait retourner 404 pour un concert inexistant", async () => {
      const res = await request(app).delete("/api/concerts/9999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Concert non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app).delete("/api/concerts/invalid");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de concert invalide");
    });
  });

  describe("GET /api/concerts/search", () => {
    it("devrait rechercher des concerts par terme", async () => {
      // Créer un concert pour la recherche
      await ConcertService.create({
        title: "Concert de Recherche",
        description: "Description pour la recherche",
        performer: "Artiste de Recherche",
        time: "20:00",
        location: "Salle de recherche",
        image: "search-image.jpg",
      });

      const res = await request(app)
        .get("/api/concerts/search")
        .query({ q: "Recherche" });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait retourner 400 si le terme de recherche est manquant", async () => {
      const res = await request(app).get("/api/concerts/search");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Terme de recherche requis");
    });
  });
});
