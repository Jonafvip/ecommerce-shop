import type { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../errors/server.error.js";
import { isError } from "../utils/error.utils.js";
import { Prisma } from "../generated/prisma/client.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          message: `Duplicate field value: ${err.meta?.target}`,
        });

      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });

      case "P2003":
        return res.status(400).json({
          success: false,
          message: "Invalid foreign key reference",
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Database request error",
        });
    }
  }

  if (isError(err)) {
    console.error("UNEXPECTED ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal serve Error",
      ...(process.env.NODE_ENV === "development" && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
