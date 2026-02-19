import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyProfile,
} from "../controller/auth.controller.js";
import {
  loginValidation,
  registerValidation,
} from "../validation/auth.validation.js";
import { validationSchema } from "../validation/schemaValidation.js";
import { verify } from "../middleware/auth.middleware.js";

const authRoute = Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 *
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the system. Validates input using Zod.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Successfully registered user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type:  string
 *                   example: successfully registered user
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad Request - Validation error or User already exists
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not Found - Required fields missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Please fill in the empty fields
 */
authRoute.post("/register", validationSchema(registerValidation), register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user and set JWT cookie
 *     description: |
 *       Logs in a user and sets a HttpOnly JWT cookie named `jwt`.
 *       The token contains user ID and role.
 *       Validation is performed via Zod (email format and password presence).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Successful login
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly JWT cookie
 *             schema:
 *               type: string
 *               example: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad Request - Missing fields, validation error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid credentials
 */
authRoute.post("/login", validationSchema(loginValidation), login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Clears the HttpOnly JWT cookie named `jwt`.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful session closure
 *         headers:
 *           Set-Cookie:
 *             description: Clears the HttpOnly JWT cookie
 *             schema:
 *               type: string
 *               example: jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 */
authRoute.post("/logout", logout);

authRoute.use(verify)
authRoute.get("/getProfile", verifyProfile);
export default authRoute;
