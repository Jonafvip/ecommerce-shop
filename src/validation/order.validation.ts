import { z } from "zod";

export const createOrderValidation = z.object({
  paymentMethod: z
    .enum(["PAYPAL", "CREDITCARD"], {
      error: "Invalid payment method. Use PAYPAL or CREDITCARD",
    })
    .default("CREDITCARD"),
  status: z
    .enum(["PENDING", "SENT", "CANCELED", "DELIVERED"])
    .default("PENDING"),
});
