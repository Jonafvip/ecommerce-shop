import request from "supertest";
import { app } from "../server.js";
import { prisma } from "../config/prisma.config.js";

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Pruebas de Producto (Flujo)", () => {
  let cookie: string;

  beforeAll(async () => {
    const unique = Date.now();
    const user = {
      username: `admin_${unique}`,
      email: `admin_${unique}@test.com`,
      password: "password123",
      role: "ADMIN" 
    };
    
    await request(app).post("/api/v1/auth/register").send(user);
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password
    });
    
    cookie = loginRes.headers["set-cookie"]![0]!;
  });

  const testProduct = {
    name: "Camara Nueva",
    description: "Resolucion 4k profesional",
    stock: 10,
    price: 60.99,
  };

  it("POST /api/v1/admin/product/ debe crear un producto", async () => {
    const response = await request(app)
      .post("/api/v1/admin/product/")
      .set("Cookie", cookie) 
      .send(testProduct);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("GET /api/v1/admin/product/ debe obtener la lista de productos", async () => {
    const response = await request(app)
      .get("/api/v1/admin/product/")
      .set("Cookie", cookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.product)).toBe(true);
    expect(response.body.product).toContainEqual(
      expect.objectContaining({ name: testProduct.name })
    );
  });
});