import type { Request, Response } from "express";
import { prisma } from "../config/prisma.config.js";
import { catchAsync } from "../middleware/errorHandlerMiddleware.js";
import { AppError } from "../errors/server.error.js";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { paymentMethod, status } = req.body;

  if (!userId) throw new AppError("User not authenticated", 401);

  if (!paymentMethod || !status)
    throw new AppError("Please fill in the empty fields", 400);

  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { product: true }, //trae los datos de la tabla de productId forma de un join
  });

  if (cartItems.length === 0) throw new AppError("Cart is empty", 400);

  let total = 0;
  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      throw new AppError(
        `Insufficient stock for ${item.product.name}. Only ${item.product.stock} left.`,
        400
      );
    }
    total += Number(item.product.price) * item.quantity;
  }

  // Ejecutar transacción atómica
  const newOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        paymentMethod,
        status,
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    await tx.cart.deleteMany({
      where: { userId },
    });

    return order;
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: newOrder,
  });
});
