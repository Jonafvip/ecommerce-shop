import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

//datos que deberian estar en la firmacion del token
interface UserPayload {
  id: number;
  role: string;
}

declare global {
  //declarion global
  namespace Express {
    //entramos en la libreria
    interface Request {
      //fusionamos las declaraciones le pegamos la nueva propiedad
      user?: UserPayload; //pegamos  el user al Request
    }
  }
}

export const verify = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    const secret_key = process.env.JWT_SECRET_KEY;

    if (!token)
      return res.status(401).json({ message: "Not authorized,no token" });

    if (!secret_key)
      return res.status(500).json({ message: "JWT secret is not defined" });

    const decoded = jwt.verify(token, secret_key) as UserPayload;
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Token incompleted" });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error instanceof Error ? error.message : "unkown error",
    });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "No authenticate" });
    if (req.user.role !== "ADMIN") {
      return res
        .status(401)
        .json({ message: "Access denied: administrator permissions required" });
    }
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Error verifying permissions",
      error: error instanceof Error ? error.message : "unkown error",
    });
  }
};
