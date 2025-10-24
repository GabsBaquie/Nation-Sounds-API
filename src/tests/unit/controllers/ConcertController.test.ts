import request from "supertest";
import { CreateConcertDto } from "../../dto/requests/create-concert.dto";
import app from "../../index";
import { ConcertService } from "../../services/ConcertService";
import {
  closeTestDB,
  createAdminUser,
  initializeTestDB,
} from "../../utils/testSetup";

describe("ConcertController API", () => {
  let adminToken: string;

  beforeAll(async () => {
    await initializeTestDB();
    adminToken = await createAdminUser();
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
      const concertData: CreateConcertDto = {
        title: "Concert Test",
        description: "Description du concert",
        performer: "Artiste Test",
        time: "20:00",
        location: "Lieu Test",
      };
      const concert = await ConcertService.create(concertData);
      expect(concert).not.toBeNull();
      const res = await request(app).get(`/api/concerts/${concert!.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", concert!.id);
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
      const concertData: CreateConcertDto = {
        title: "Nouveau Concert",
        description: "Description du nouveau concert",
        performer: "Nouvel Artiste",
        time: "21:00",
        location: "Nouveau Lieu",
      };
      const res = await request(app)
        .post("/api/concerts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(concertData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Nouveau Concert");
    });

    it("devrait retourner 401 sans token d'authentification", async () => {
      const concertData: CreateConcertDto = {
        title: "Concert Sans Token",
        description: "Description",
        performer: "Artiste",
        time: "20:00",
        location: "Lieu",
      };
      const res = await request(app).post("/api/concerts").send(concertData);
      expect(res.status).toBe(401);
    });

    it("devrait retourner 400 pour des données invalides", async () => {
      const res = await request(app)
        .post("/api/concerts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({}); // Données invalides
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/concerts/:id", () => {
    it("devrait mettre à jour un concert existant", async () => {
      const concertData: CreateConcertDto = {
        title: "Concert Original",
        description: "Description originale",
        performer: "Artiste Original",
        time: "20:00",
        location: "Lieu Original",
      };
      const concert = await ConcertService.create(concertData);
      expect(concert).not.toBeNull();
      const updateData: CreateConcertDto = {
        title: "Concert Modifié",
        description: "Description modifiée",
        performer: "Artiste Modifié",
        time: "21:00",
        location: "Lieu Modifié",
      };
      const res = await request(app)
        .put(`/api/concerts/${concert!.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", updateData.title);
    });

    it("devrait retourner 404 pour un concert inexistant", async () => {
      const updateData: CreateConcertDto = {
        title: "Concert Inexistant",
        description: "Description",
        performer: "Artiste",
        time: "20:00",
        location: "Lieu",
      };
      const res = await request(app)
        .put("/api/concerts/9999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Concert non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const updateData: CreateConcertDto = {
        title: "Concert Invalide",
        description: "Description",
        performer: "Artiste",
        time: "20:00",
        location: "Lieu",
      };
      const res = await request(app)
        .put("/api/concerts/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de concert invalide");
    });
  });

  describe("DELETE /api/concerts/:id", () => {
    it("devrait supprimer un concert existant", async () => {
      const concertData: CreateConcertDto = {
        title: "Concert à Supprimer",
        description: "Description",
        performer: "Artiste",
        time: "20:00",
        location: "Lieu",
      };
      const concert = await ConcertService.create(concertData);
      expect(concert).not.toBeNull();
      const res = await request(app)
        .delete(`/api/concerts/${concert!.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Concert supprimé avec succès"
      );
    });

    it("devrait retourner 404 pour un concert inexistant", async () => {
      const res = await request(app)
        .delete("/api/concerts/9999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Concert non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app)
        .delete("/api/concerts/invalid")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID de concert invalide");
    });
  });

  describe("GET /api/concerts/search", () => {
    it("devrait rechercher des concerts", async () => {
      const res = await request(app)
        .get("/api/concerts/search")
        .query({ q: "Recherche" });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait retourner 400 si le paramètre de recherche est manquant", async () => {
      const res = await request(app).get("/api/concerts/search");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Paramètre de recherche requis"
      );
    });
  });
});
