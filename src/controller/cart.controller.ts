import { prisma } from "../config/prisma.config.js";
import type { Request, Response } from "express";
import { catchAsync } from "../middleware/errorHandlerMiddleware.js";
import { AppError } from "../errors/server.error.js";

export const addProductToCart = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    if (!userId) throw new AppError("User not authenticated", 401);

    const productCart = await prisma.product.findFirst({
      where: { id: Number(id) },
    });

    if (!productCart) throw new AppError("Product not found", 404);

    let cartItem = await prisma.cart.findFirst({
      where: {
        userId: userId,
        productId: Number(id),
      },
    });

    if (cartItem) {
      // Si ya existe, validamos el stock total (existente + nuevo)
      const newQuantity = cartItem.quantity + quantity;
      if (productCart.stock < newQuantity) {
        throw new AppError(
          `Insufficient stock. Only ${productCart.stock} units available in total.`,
          400
        );
      }

      // Actualizamos la cantidad
      cartItem = await prisma.cart.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Si no existe, validamos el stock para la cantidad inicial
      if (productCart.stock < quantity) {
        throw new AppError(
          `Insufficient stock. Only ${productCart.stock} units available.`,
          400
        );
      }

      // Creamos el nuevo item en el carrito
      cartItem = await prisma.cart.create({
        data: {
          userId: userId,
          productId: Number(id),
          quantity: quantity,
        },
      });
    }

    res.status(200).json({
      message: cartItem ? "Cart updated correctly" : "Product added to cart",
      data: cartItem,
      success: true,
    });
  }
);

export const removeProductFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const productCart = await prisma.product.findFirst({
      where: { id: Number(id) },
    });

    if (!productCart) throw new AppError("Product not found", 404);

    const cartProduct = await prisma.cart.deleteMany({
      where: {
        userId: userId!,
        productId: Number(id),
      },
    });

    if (cartProduct.count === 0)
      throw new AppError(
        "The product was not found in the cart for this user.",
        404
      );
    return res.status(200).json({
      message: "product disposed correctly",
      deleteCount: cartProduct,
    });
  }
);

export const emptyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const cartProduct = await prisma.cart.deleteMany({
    where: {
      userId: userId!,
    },
  });

  if (cartProduct.count === 0) {
    throw new AppError(
      "The product was not found in the cart for this user.",
      404
    );
  }

  return res.status(200).json({
    message: "Cart emptied successfully",
    deletedCount: cartProduct.count,
  });
});
