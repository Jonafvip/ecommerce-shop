import request from "supertest";
import { app } from "../server.js";
import { prisma } from "../config/prisma.config.js";

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Pruebas de Autenticación (Registro, Login, Logout)", () => {
  const uniqueSuffix = Date.now();
  const testUser = {
    username: `user_${uniqueSuffix}`,
    email: `test_${uniqueSuffix}@example.com`,
    password: "password1234",
  };

  it("POST /api/v1/auth/register debe registrar un usuario exitosamente", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      message: "successfully registered user",
      success: true,
    });
  });

  it("POST /api/v1/auth/login debe iniciar sesión exitosamente", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "Successful login",
      success: true,
    });
    // Verificar que devuelve un token y establece la cookie
    expect(response.body).toHaveProperty("token");
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});
