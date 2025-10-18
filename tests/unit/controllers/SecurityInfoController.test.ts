import request from "supertest";
import app from "../../../src/index";
import { SecurityInfoService } from "../../../src/services/SecurityInfoService";
import { closeTestDB, initializeTestDB } from "../../../src/utils/testSetup";

beforeAll(async () => {
  await initializeTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("SecurityInfo API", () => {
  it("créer une nouvelle information de sécurité", async () => {
    const res = await request(app).post("/api/securityInfos").send({
      title: "Test Sécurité",
      description: "Description de test",
      urgence: false,
      actif: true,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test Sécurité");
  });

  it("récupérer toutes les informations de sécurité", async () => {
    const res = await request(app).get("/api/securityInfos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("devrait retourner 404 pour une information de sécurité inexistante", async () => {
    const res = await request(app).get("/api/securityInfos/9999"); // ID inexistant

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "message",
      "Information de sécurité non trouvée"
    );
  });

  it("récupérer une information de sécurité par ID", async () => {
    const securityInfo = await SecurityInfoService.create({
      title: "Info Par ID",
      description: "Description par ID",
      urgence: true,
      actif: true,
    });

    const res = await request(app).get(`/api/securityInfos/${securityInfo.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Info Par ID");
  });

  it("mettre à jour une information de sécurité", async () => {
    const securityInfo = await SecurityInfoService.create({
      title: "Info à Mettre à Jour",
      description: "Description initiale",
      urgence: false,
      actif: true,
    });

    const res = await request(app)
      .put(`/api/securityInfos/${securityInfo.id}`)
      .send({
        title: "Info Mise à Jour",
        description: "Description mise à jour",
        urgence: true,
        actif: false,
      });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Info Mise à Jour");
  });

  it("ne devrait pas mettre à jour une information de sécurité inexistante", async () => {
    const res = await request(app).put("/api/securityInfos/9999").send({
      title: "Non Existant",
      description: "Description",
      urgence: true,
      actif: true,
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "message",
      "Information de sécurité non trouvée"
    );
  });

  it("supprimer une information de sécurité", async () => {
    const securityInfo = await SecurityInfoService.create({
      title: "Info à Supprimer",
      description: "Description à supprimer",
      urgence: false,
      actif: false,
    });

    const res = await request(app).delete(
      `/api/securityInfos/${securityInfo.id}`
    );
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(
      "Information de sécurité supprimée avec succès"
    );
  });

  it("devrait retourner 404 pour une information de sécurité inexistante", async () => {
    const res = await request(app).get("/api/securityInfos/9999"); // ID inexistant

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "message",
      "Information de sécurité non trouvée"
    );
  });
});
