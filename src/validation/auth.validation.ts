import { z } from "zod";

export const registerValidation = z.object({
  username: z
    .string()
    .min(3, { error: "The username must be at least 3 characters long." })
    .max(40, {
      error: "The username is too long, it must be less than 40 characters.",
    }),
  email: z.string().email({ error: "email invalid" }),
  password: z
    .string()
    .min(6, { error: "The password must be at least 6 characters long" })
    .max(20, { error: "The password must be less than 20 characters." }),
  role: z.string().default("USER"),
});

export const loginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(1, { error: "Password is required" }),
});
