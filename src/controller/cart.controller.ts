import { prisma } from "../config/prisma.config.js";
import type { Request, Response } from "express";
import { catchAsync } from "../middleware/errorHandlerMiddleware.js";
import { AppError } from "../errors/server.error.js";

export const addProductToCart = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    if (!userId) throw new AppError("Not authenticated", 401);

    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
    });

    if (!product) throw new AppError("Product not found", 404);

    let cartItem = await prisma.cart.findFirst({
      where: {
        userId: userId,
        productId: Number(id),
      },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new AppError(
          `Insufficient stock. Only ${product.stock} units available in total.`,
          400
        );
      }

      cartItem = await prisma.cart.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      if (product.stock < quantity) {
        throw new AppError(
          `Insufficient stock. Only ${product.stock} units available.`,
          400
        );
      }

      cartItem = await prisma.cart.create({
        data: {
          userId: userId,
          productId: Number(id),
          quantity: quantity,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cartItem,
    });
  }
);

export const removeProductFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) throw new AppError("Not authenticated", 401);

    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
    });

    if (!product) throw new AppError("Product not found", 404);

    const deletedItem = await prisma.cart.deleteMany({
      where: {
        userId: userId,
        productId: Number(id),
      },
    });

    if (deletedItem.count === 0) {
      throw new AppError("Product was not found in the cart", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });
  }
);

export const emptyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw new AppError("Not authenticated", 401);

  const deletedItems = await prisma.cart.deleteMany({
    where: { userId },
  });

  if (deletedItems.count === 0) {
    throw new AppError("Cart is already empty", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Cart emptied successfully",
  });
});

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw new AppError("Not authenticated", 401);

  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: {
      product: true,
    },
  });

  return res.status(200).json({
    success: true,
    data: cartItems,
  });
});

export const updateCartQuantity = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!userId) throw new AppError("Not authenticated", 401);

    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
    });

    if (!product) throw new AppError("Product not found", 404);
    if (product.stock < quantity) {
      throw new AppError(
        `Insufficient stock. Only ${product.stock} units available.`,
        400
      );
    }

    const cartItem = await prisma.cart.findFirst({
      where: {
        userId: userId,
        productId: Number(id),
      },
    });

    if (!cartItem) throw new AppError("Item not found in cart", 404);

    const updatedItem = await prisma.cart.update({
      where: { id: cartItem.id },
      data: { quantity: Number(quantity) },
    });

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      data: updatedItem,
    });
  }
);
