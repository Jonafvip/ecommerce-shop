import { prisma } from "../config/prisma.config.js";
import type { Request, Response } from "express";
import { catchAsync } from "../middleware/errorHandlerMiddleware.js";
import { AppError } from "../errors/server.error.js";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({});

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  }
);

export const getProductId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) throw new AppError("Product not found", 404);

  res.status(200).json({
    success: true,
    message: "Product found successfully",
    data: product,
  });
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
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  }
);

//pendiente con las relaciones de restricciones
export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Primero verificar si existe
  const existingProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!existingProduct) throw new AppError("Product not found", 404);

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  res.status(200).json({
    success: true,
    message: "Product successfully removed",
  });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, stock, price } = req.body;

  if (!name || !description || !stock || !price)
    throw new AppError("Please fill in the empty fields", 400);

  const updatedProduct = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
      stock,
      price,
    },
  });

  res.status(200).json({
    success: true,
    message: "Product successfully updated",
    data: updatedProduct,
  });
});
