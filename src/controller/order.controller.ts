import type { Request, Response } from "express";
import { prisma } from "../config/prisma.config.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { paymentMethod, status } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!paymentMethod || !status) {
      return res
        .status(400)
        .json({ message: "Please fill in the empty fields" });
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true }, //trae los datos de la tabla de productId forma de un join
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} left.`,
        });
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

    return res.status(201).json({
      message: "Order placed correctly",
      order: newOrder,
      success: true,
    });
  } catch (error) {
    console.error("Order Error:", error);
    return res.status(500).json({
    message: "Internal server error",
    error: error instanceof Error ? error.message : error,
    });
  }
};
