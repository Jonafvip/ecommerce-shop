import { z } from "zod";

export const addProductToCartValidation = z.object({
  quantity: z.coerce
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0")
    .default(1),
});

export const cartParamsValidation = z.object({
  id: z.coerce.number().int().positive("Invalid Product ID"),
});
