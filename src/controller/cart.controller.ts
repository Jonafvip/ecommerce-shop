import { prisma } from "../config/prisma.config.js";
import type { Request, Response } from "express";

export const addProductToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const productCart = await prisma.product.findFirst({
      where: { id: Number(id) },
    });

    if (!productCart) {
      return res.status(404).json({ message: "Product not found" });
    }

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
        return res.status(400).json({
          message: `Insufficient stock. Only ${productCart.stock} units available in total.`,
        });
      }

      // Actualizamos la cantidad
      cartItem = await prisma.cart.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Si no existe, validamos el stock para la cantidad inicial
      if (productCart.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock. Only ${productCart.stock} units available.`,
        });
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

    return res.status(200).json({
      message: cartItem ? "Cart updated correctly" : "Product added to cart",
      data: cartItem,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const removeProductFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const productCart = await prisma.product.findFirst({
      where: { id: Number(id) },
    });

    if (!productCart) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartProduct = await prisma.cart.deleteMany({
      where: {
        userId: userId!,
        productId: Number(id),
      },
    });

    if (cartProduct.count === 0) {
      return res.status(404).json({
        message: "The product was not found in the cart for this user.",
      });
    }
    return res
      .status(200)
      .json({
        message: "product disposed correctly",
        deleteCount: cartProduct,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};


export const emptyCart = async(req:Request,res:Response) => {

}