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
