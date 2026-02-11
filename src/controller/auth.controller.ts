import { prisma } from "../config/prisma.config.js";
import { Prisma } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in the empty fields" });
    }

    const userExisting = await prisma.user.findFirst({
      where: { OR: [{ email: email }, { username: username }] },
    });

    console.log(userExisting);

    if (userExisting) {
      return res.status(400).json({ message: "This user already exists" });
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    return res.status(201).json({
      message: "successfully registered user",
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in the empty fields" });
    }

    const userExisting = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!userExisting) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const isMatch = await bcrypt.compare(password, userExisting.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid user" });

    return res.status(200).json({ message: "Successful login", success: true });
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
