import { Router } from "express";
import { verify } from "../middleware/auth.middleware.js";
import { createOrder } from "../controller/order.controller.js";
import { validationSchema } from "../validation/schemaValidation.js";
import { createOrderValidation } from "../validation/order.validation.js";

const orderRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order processing and management
 */

orderRoute.use(verify);

/**
 * @swagger
 * /api/v1/auth/orderCart:
 *   post:
 *     summary: Place a new order
 *     description: Converts items in the user's cart into an order. Deducts stock and empties the cart.
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Bad Request - Cart is empty, insufficient stock, or validation error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - User not authenticated
 */
orderRoute.post("/", validationSchema(createOrderValidation), createOrder);

export default orderRoute;
