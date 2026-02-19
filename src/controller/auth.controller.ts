import { prisma } from "../config/prisma.config.js";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { authToken } from "../utils/auth.utils.js";
import { AppError } from "../errors/server.error.js";
import { catchAsync } from "../middleware/errorHandlerMiddleware.js";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    throw new AppError("Please fill in the empty fields", 404);
  }

  const userExisting = await prisma.user.findFirst({
    where: { OR: [{ email: email }, { username: username }] },
  });

  if (userExisting) {
    throw new AppError("This user already exists", 400);
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

  res.status(201).json({
    message: "successfully registered user",
    data: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
    success: true,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const userExisting = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!userExisting) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, userExisting.password);
  if (!isMatch) throw new AppError("Invalid user", 400);

  const token = authToken(userExisting.id, userExisting.role);

  res.cookie("jwt", token, { httpOnly: true, sameSite: "strict" });

  res.status(200).json({
    message: "Successful login",
    success: true,
    data: {
      id: userExisting.id,
      email: userExisting.email,
      role: userExisting.role,
    },
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  return res.status(200).json({ message: "Successful session closure" });
});

export const verifyProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("No Authenticate", 401);

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError("Usuario no encontrado", 404);

  res.status(200).json({
    success: true,
    data: user,
  });
});
