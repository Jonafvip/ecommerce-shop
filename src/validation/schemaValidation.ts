import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

type RequestLocation = "body" | "params" | "query";

export const validationSchema =
  (schema: z.ZodObject<any>, location: RequestLocation = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedDate = await schema.parseAsync(req[location]);
      req[location] = validatedDate;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          location: location,
          errors: error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
