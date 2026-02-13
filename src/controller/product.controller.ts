import { prisma } from "../config/prisma.config.js";
import { Prisma } from "../generated/prisma/client.js";
import type { Request, Response } from "express";

export const createProducts = async (req: Request, res: Response) => {
  try {
    const { name, description, stock, price } = req.body;

    if (!name || !description || !stock || !price)
      return res
        .status(400)
        .json({ message: "Please fill in the empty fields" });

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
      },
    });

    return res.status(201).json({
      message: "successfully created",
      data: { newProduct },
      success: true,
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("Error of Prisma:", error.code);
      return;
    } else if (error instanceof Error) {
      return res.json({
        message: "The user could not be registered.",
        error: error.message,
      });
    } else {
      return res.json({ message: "Internal server problems", error: error });
    }
  }
};

//pendiente con las relaciones de restricciones
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = await prisma.product.delete({
      where: { id: Number(id) },
    });

    if (!productId)
      return res.status(404).json({ message: "Product not found" });

    return res
      .status(200)
      .json({ message: "product successfully removed", success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("Error of Prisma:", error.code);
      return;
    } else if (error instanceof Error) {
      return res.status(500).json({
        message: "The product could not be removed.",
        error: error.message,
      });
    } else {
      return res.json({ message: "Internal server problems", error: error });
    }
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, stock, price } = req.body;

    if (!name || !description || !stock || !price)
      return res
        .status(400)
        .json({ message: "Please fill in the empty fields" });

    const upProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        stock,
        price,
      },
    });

    return res.status(200).json({
      message: "successfully updated product",
      success: true,
      data: { upProduct },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("Error of Prisma:", error.code);
      return;
    } else if (error instanceof Error) {
      return res.status(500).json({
        message: "The product could not be update.",
        error: error.message,
      });
    } else {
      return res.json({ message: "Internal server problems", error: error });
    }
  }
};
