import { z } from "zod";

export const CreateProductValidation = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),
  description: z
    .string()
    .min(10, "Description should be more detailed (min 10 chars)")
    .max(150, "Description cannot exceed 150 characters"),
  stock: z.coerce
    .number()
    .int("Stock must be an integer number")
    .nonnegative("Stock cannot be negative")
    .default(0),
  price: z.coerce.number().positive("Price must be greater than 0").finite(),
});

export const updateProductValidation = z.object({
  body: CreateProductValidation,
  params: z.object({
    id: z.coerce.number().int().positive("Invalid Product ID"),
  }),
});

export const deleteProductValidation = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid Product ID"),
  }),
});
