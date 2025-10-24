import request from "supertest";
import app from "../../index";
import { UserService } from "../../services/UserService";
import {
  closeTestDB,
  createAdminUser,
  initializeTestDB,
} from "../../utils/testSetup";

describe("AuthController API", () => {
  let adminToken: string;
  let adminUser: any;

  beforeAll(async () => {
    await initializeTestDB();
    adminToken = await createAdminUser();
    adminUser = await UserService.findByEmail("admin@example.com");
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("POST /api/auth/login", () => {
    it("devrait se connecter avec des identifiants valides", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "adminPass123",
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Connexion réussie");
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe("admin@example.com");
    });

    it("devrait retourner 400 si email ou mot de passe manquant", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        // password manquant
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Email et mot de passe requis"
      );
    });

    it("devrait retourner 401 avec un email invalide", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Email invalide");
    });

    it("devrait retourner 401 avec un mot de passe invalide", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "wrongpassword",
      });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Mot de passe invalide");
    });
  });

  describe("GET /api/auth/profile", () => {
    it("devrait récupérer le profil de l'utilisateur connecté", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("role");
      expect(res.body.email).toBe("admin@example.com");
    });

    it("devrait retourner 401 sans token d'authentification", async () => {
      const res = await request(app).get("/api/auth/profile");
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/auth/change-password", () => {
    it("devrait changer le mot de passe avec l'ancien mot de passe correct", async () => {
      const res = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          oldPassword: "adminPass123",
          newPassword: "newPassword123",
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Mot de passe changé avec succès"
      );
    });

    it("devrait retourner 400 avec l'ancien mot de passe incorrect", async () => {
      const res = await request(app)
        .put("/api/auth/change-password")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          oldPassword: "wrongpassword",
          newPassword: "newPassword123",
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Ancien mot de passe incorrect"
      );
    });

    it("devrait retourner 401 sans token d'authentification", async () => {
      const res = await request(app).put("/api/auth/change-password").send({
        oldPassword: "adminPass123",
        newPassword: "newPassword123",
      });
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/request-password-reset", () => {
    it("devrait envoyer une demande de réinitialisation pour un email existant", async () => {
      const res = await request(app)
        .post("/api/auth/request-password-reset")
        .send({
          email: "admin@example.com",
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("devrait retourner le même message pour un email inexistant (sécurité)", async () => {
      const res = await request(app)
        .post("/api/auth/request-password-reset")
        .send({
          email: "nonexistent@example.com",
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("devrait retourner 400 si l'email est manquant", async () => {
      const res = await request(app)
        .post("/api/auth/request-password-reset")
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "L'email est requis");
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("devrait réinitialiser le mot de passe avec un token valide", async () => {
      // Créer un token de réinitialisation valide
      const user = await UserService.findByEmail("admin@example.com");
      const resetToken = "valid-reset-token";
      const expiration = new Date(Date.now() + 3600000); // 1 heure
      await UserService.updateResetToken(user!.email, resetToken, expiration);

      const res = await request(app).post("/api/auth/reset-password").send({
        token: resetToken,
        newPassword: "newResetPassword123",
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Mot de passe réinitialisé avec succès"
      );
    });

    it("devrait retourner 400 avec un token invalide", async () => {
      const res = await request(app).post("/api/auth/reset-password").send({
        token: "invalid-token",
        newPassword: "newPassword123",
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Jeton invalide ou expiré");
    });

    it("devrait retourner 400 avec un token expiré", async () => {
      // Créer un token expiré
      const user = await UserService.findByEmail("admin@example.com");
      const expiredToken = "expired-token";
      await UserService.updateResetTokenExpired(user!.email, expiredToken);

      const res = await request(app).post("/api/auth/reset-password").send({
        token: expiredToken,
        newPassword: "newPassword123",
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Jeton invalide ou expiré");
    });
  });
});
