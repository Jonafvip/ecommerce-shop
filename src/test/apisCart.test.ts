import request from "supertest";
import { app } from "../server.js";
import { prisma } from "../config/prisma.config.js";

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Pruebas de Carrito (Flujo)", () => {
  let userCookie: string;
  let adminCookie: string;
  let productId: number;

  beforeAll(async () => {
    const unique = Date.now();

    const adminData = {
      username: `admin_setup_${unique}`,
      email: `admin_setup_${unique}@test.com`,
      password: "password123",
      role: "ADMIN",
    };
    await request(app).post("/api/v1/auth/register").send(adminData);
    const adminLogin = await request(app).post("/api/v1/auth/login").send({
      email: adminData.email,
      password: adminData.password,
    });
    adminCookie = adminLogin.headers["set-cookie"]![0]!;

    const userData = {
      username: `customer_${unique}`,
      email: `customer_${unique}@test.com`,
      password: "password123",
      role: "USER",
    };
    await request(app).post("/api/v1/auth/register").send(userData);
    const userLogin = await request(app).post("/api/v1/auth/login").send({
      email: userData.email,
      password: userData.password,
    });
    userCookie = userLogin.headers["set-cookie"]![0]!;

    const productRes = await request(app)
      .post("/api/v1/admin/product/")
      .set("Cookie", adminCookie)
      .send({
        name: `Producto Test ${unique}`,
        description: "Para probar el carrito",
        stock: 10,
        price: 50.0,
      });

    productId = productRes.body.data.newProduct.id;
  });

  it("POST /api/v1/auth/cart/:id - Un USER normal debe poder agregar el producto", async () => {
    const response = await request(app)
      .post(`/api/v1/auth/cart/${productId}`)
      .set("Cookie", userCookie)
      .send({ quantity: 1 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.quantity).toBe(1);
  });
});
