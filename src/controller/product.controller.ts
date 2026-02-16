import { prisma } from "../config/prisma.config.js";
import type { Request, Response } from "express";
import { catchAsync } from "../middleware/errorHandlerMiddleware.js";
import { AppError } from "../errors/server.error.js";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const product = await prisma.product.findMany({});
    if (!product) throw new AppError("Product not found", 404);

    res.status(200).json({ product, success: true });
  }
);

export const getProductId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productId = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!productId) throw new AppError("Product not found", 404);

  res.status(200).json({ data: { productId } });
});

export const createProducts = catchAsync(
  async (req: Request, res: Response) => {
    const { name, description, stock, price } = req.body;

    if (!name || !description || !stock || !price)
      throw new AppError("Please fill in the empty fields", 400);

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
      },
    });

    res.status(201).json({
      message: "successfully created",
      data: { newProduct },
      success: true,
    });
  }
);

//pendiente con las relaciones de restricciones
export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productId = await prisma.product.delete({
    where: { id: Number(id) },
  });

  if (!productId) throw new AppError("Product not found", 404);

  res
    .status(200)
    .json({ message: "product successfully removed", success: true });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, stock, price } = req.body;

  if (!name || !description || !stock || !price)
    throw new AppError("Please fill in the empty fields", 400);

  const upProduct = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
      stock,
      price,
    },
  });

  res.status(200).json({
    message: "successfully updated product",
    success: true,
    data: { upProduct },
  });
});
