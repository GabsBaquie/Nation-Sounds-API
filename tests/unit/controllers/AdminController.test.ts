import request from "supertest";
import { CreateUserDto } from "../../../src/dto/requests/create-user.dto";
import app from "../../../src/index";
import { UserService } from "../../../src/services/UserService";
import {
  closeTestDB,
  createAdminUser,
  initializeTestDB,
} from "../../../src/utils/testSetup";

describe("AdminController API", () => {
  let adminToken: string;

  beforeAll(async () => {
    await initializeTestDB();
    adminToken = await createAdminUser();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("GET /api/admin/users", () => {
    it("devrait récupérer tous les utilisateurs", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait retourner 401 sans token d'administration", async () => {
      const res = await request(app).get("/api/admin/users");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/admin/users", () => {
    it("devrait créer un nouvel utilisateur", async () => {
      const userData: CreateUserDto = {
        username: "nouvelutilisateur",
        email: "nouvel@gmail.com",
        password: "password123",
        role: "user" as any,
      };
      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(userData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.username).toBe("nouvelutilisateur");
    });

    it("devrait retourner 400 pour des données invalides", async () => {
      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({}); // Données invalides
      expect(res.status).toBe(400);
    });

    it("devrait retourner 401 sans token d'administration", async () => {
      const userData: CreateUserDto = {
        username: "utilisateur",
        email: "user@example.com",
        password: "password123",
        role: "user" as any,
      };
      const res = await request(app).post("/api/admin/users").send(userData);
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/admin/users/:id", () => {
    it("devrait récupérer un utilisateur par ID", async () => {
      const userData: CreateUserDto = {
        username: "utilisateur_test",
        email: "test@example.com",
        password: "password123",
        role: "user" as any,
      };
      const user = await UserService.create({
        ...userData,
        password: "hashedpassword",
      });
      const res = await request(app)
        .get(`/api/admin/users/${user.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", user.id);
    });

    it("devrait retourner 404 pour un utilisateur inexistant", async () => {
      const res = await request(app)
        .get("/api/admin/users/9999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Utilisateur non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app)
        .get("/api/admin/users/invalid")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID d'utilisateur invalide");
    });
  });

  describe("PUT /api/admin/users/:id", () => {
    it("devrait mettre à jour un utilisateur existant", async () => {
      const userData: CreateUserDto = {
        username: "utilisateur_original",
        email: "original@gmail.com",
        password: "password123",
        role: "user" as any,
      };
      const user = await UserService.create({
        ...userData,
        password: "hashedpassword",
      });
      const updateData = {
        username: "utilisateur_modifié",
        role: "admin",
      };
      const res = await request(app)
        .put(`/api/admin/users/${user.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("username", updateData.username);
    });

    it("devrait retourner 404 pour un utilisateur inexistant", async () => {
      const updateData = {
        username: "utilisateur_inexistant",
      };
      const res = await request(app)
        .put("/api/admin/users/9999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Utilisateur non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const updateData = {
        username: "utilisateur_invalide",
      };
      const res = await request(app)
        .put("/api/admin/users/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID d'utilisateur invalide");
    });
  });

  describe("DELETE /api/admin/users/:id", () => {
    it("devrait supprimer un utilisateur existant", async () => {
      const userData: CreateUserDto = {
        username: "utilisateur_a_supprimer",
        email: "supprimer@example.com",
        password: "password123",
        role: "user" as any,
      };
      const user = await UserService.create({
        ...userData,
        password: "hashedpassword",
      });
      const res = await request(app)
        .delete(`/api/admin/users/${user.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Utilisateur supprimé avec succès"
      );
    });

    it("devrait retourner 404 pour un utilisateur inexistant", async () => {
      const res = await request(app)
        .delete("/api/admin/users/9999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Utilisateur non trouvé");
    });

    it("devrait retourner 400 pour un ID invalide", async () => {
      const res = await request(app)
        .delete("/api/admin/users/invalid")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "ID d'utilisateur invalide");
    });
  });
});
