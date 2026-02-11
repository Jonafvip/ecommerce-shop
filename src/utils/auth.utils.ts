import jwt from "jsonwebtoken";

export const authToken = (id: number, role: string): string => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const expiresIn = process.env.EXPIRE_IN || "1d";

  if (!secretKey) {
    throw new Error(
      "JWT_SECRET_KEY no está configurado en las variables de entorno"
    );
  }
  return jwt.sign({ id, role }, secretKey, { expiresIn } as jwt.SignOptions);
};
